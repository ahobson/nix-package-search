import * as child from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

function runOrExit(msg: string, spawned: child.SpawnSyncReturns<String>) {
  if (spawned.error || spawned.status != 0) {
    console.log('msg: ', msg)
    console.log('stderr: ', spawned.stderr.toString())
    console.log('stdout: ', spawned.stdout.toString())
    process.exit(1)
  }
}

type PackageVersionInfo = {
  nixPkgName: string
  name: string
  pname: string
  version: string
  sha: string
}

type PackageVersions = {
  [nixPkgNamePnameVersion: string]: PackageVersionInfo
}

type AllPackages = {
  [name: string]: PackageVersions
}

type NixPackageInfo = {
  name: string
  pname: string
  version: string
}

function isNixPkgInfo(nixPkgInfo: any): nixPkgInfo is NixPackageInfo {
  return (
    typeof nixPkgInfo === 'object' &&
    typeof nixPkgInfo['name'] === 'string' &&
    typeof nixPkgInfo['pname'] === 'string' &&
    typeof nixPkgInfo['version'] === 'string'
  )
}

async function readAllPackagesCsv(
  allPackagesCsvFile: string
): Promise<AllPackages> {
  const lines = fs
    .readFileSync(allPackagesCsvFile, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const allPackages: AllPackages = {}
  for (const line of lines) {
    const [pname, nixPkgName, name, version, sha] = line.split(',')
    const subkey = [name, nixPkgName, version].join('|')
    let pkgVersions: PackageVersions = {}
    if (pname in allPackages) {
      pkgVersions = allPackages[pname]
    } else {
      allPackages[pname] = pkgVersions
    }
    if (subkey in pkgVersions) {
      // should never happen
      return Promise.reject(
        `Error reading ${allPackagesCsvFile}: ${subkey} already exists`
      )
    }
    pkgVersions[subkey] = {
      nixPkgName: nixPkgName,
      name: name,
      pname: pname,
      version: version,
      sha: sha,
    }
  }
  return Promise.resolve(allPackages)
}

async function updateAllPackages(
  allPackagesCsvFile: string,
  sha: string
): Promise<number> {
  const currentAllPackages = await readAllPackagesCsv(allPackagesCsvFile)
  const gitCo = child.spawnSync('git', ['checkout', sha])
  runOrExit('git checkout sha', gitCo)
  const allPkgCmd = child.spawnSync('nix-env', ['-f', '.', '-qa', '--json'], {
    maxBuffer: 1024 * 1024 * 1024,
    encoding: 'utf8',
  })
  if (allPkgCmd.error || allPkgCmd.status != 0) {
    console.log(`WARN: nix-env problem, skipping: ${allPkgCmd.stderr}`)
    return Promise.resolve(0)
  }
  const allPackages = JSON.parse(allPkgCmd.stdout.toString())
  Object.entries(allPackages).forEach(([nixPkgName, nixInfo]) => {
    if (nixPkgName === undefined) {
      return Promise.reject('nixPkgName undefined iterating JSON')
    }
    if (!isNixPkgInfo(nixInfo)) {
      return Promise.reject(
        `${nixPkgName} has value that is not nixInfo: ${nixInfo}`
      )
    }
    let currentPkgVersions: PackageVersions = {}
    if (nixInfo.pname in currentAllPackages) {
      currentPkgVersions = currentAllPackages[nixInfo.pname]
    } else {
      currentAllPackages[nixInfo.pname] = currentPkgVersions
    }
    const subkey = [nixInfo.name, nixPkgName, nixInfo.version].join('|')
    if (!(subkey in currentPkgVersions)) {
      currentPkgVersions[subkey] = {
        nixPkgName: nixPkgName,
        name: nixInfo.name,
        pname: nixInfo.pname,
        version: nixInfo.version,
        sha: sha,
      }
    }
  })
  const dataLines: string[] = []
  Object.keys(currentAllPackages)
    .sort()
    .forEach((pname) => {
      const pkgVersions = currentAllPackages[pname]
      Object.keys(pkgVersions)
        .sort()
        .forEach((subkey) => {
          const pkgVersionInfo = pkgVersions[subkey]
          const line = [
            pkgVersionInfo.pname,
            pkgVersionInfo.nixPkgName,
            pkgVersionInfo.name,
            pkgVersionInfo.version,
            pkgVersionInfo.sha,
          ].join(',')
          dataLines.push(line)
        })
    })
  const tmpFilename = `${allPackagesCsvFile}.new`
  fs.writeFileSync(tmpFilename, dataLines.join('\n') + '\n')
  fs.renameSync(tmpFilename, allPackagesCsvFile)
  return Promise.resolve(dataLines.length)
}

const NIXPKGS_GIT_REPO = 'https://github.com/NixOS/nixpkgs.git'
const LAST_SEEN = 'public/nix/nixpkgs-unstable/last_seen.txt'
const ALL_PACKAGES = 'public/nix/nixpkgs-unstable/all_packages.csv'

async function generateUpdate(): Promise<void> {
  // get the latest info from the gh-pages branch

  const fetch = child.spawnSync('git', ['fetch', 'origin'])
  runOrExit('git fetch', fetch)

  const restore = child.spawnSync('git', [
    '--work-tree',
    'public',
    'restore',
    '-s',
    'origin/gh-pages',
    'nix',
  ])
  runOrExit('git restore', restore)
  const lastSeenFile = path.resolve(LAST_SEEN)
  const distDir = path.resolve('/tmp')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
  }

  const allPackagesFile = path.resolve(ALL_PACKAGES)
  if (!fs.existsSync(allPackagesFile)) {
    fs.writeFileSync(allPackagesFile, '')
  }

  const nixpkgsDir = path.resolve(distDir, 'nixpkgs')
  if (fs.existsSync(nixpkgsDir)) {
    const fetch = child.spawnSync('git', ['fetch', 'origin'], {
      cwd: nixpkgsDir,
      encoding: 'utf8',
    })
    runOrExit('git fetch', fetch)
  } else {
    const clone = child.spawnSync('git', ['clone', NIXPKGS_GIT_REPO], {
      cwd: distDir,
      encoding: 'utf8',
    })
    runOrExit('git clone', clone)
  }
  const checkout = child.spawnSync(
    'git',
    ['checkout', 'origin/nixpkgs-unstable'],
    {
      cwd: nixpkgsDir,
      encoding: 'utf8',
    }
  )
  runOrExit('git checkout', checkout)

  process.chdir(nixpkgsDir)

  const lastSeen = fs.existsSync(lastSeenFile)
    ? fs.readFileSync(lastSeenFile, 'utf8').trim()
    : '2019-03-01'

  const revlist = child.spawnSync(
    'git',
    [
      'log',
      '--since',
      lastSeen,
      '--format=%H %ci',
      '--date-order',
      '--no-merges',
      '--dense',
    ],
    { encoding: 'utf8', maxBuffer: 40960000 }
  )
  runOrExit('git log', revlist)

  let lastSeenDate = Date.parse(lastSeen)
  const seenLimit = 2 * 24 * 60 * 60 * 1000

  // git log shows newest first and we need to process oldest first
  const revs = revlist.output
    .join('')
    .split('\n')
    .filter((line) => line.length > 0)
    .reverse()
  fs.writeFileSync('revs.txt', revs.join('\n') + '\n')

  let lastLine = revs[0]
  for (const line of revs) {
    lastLine = line
    const [sha, ymd, hms, tzoff] = line.split(' ')
    const commitDateStr = [ymd, hms, tzoff].join(' ')
    const seenDate = Date.parse(commitDateStr)
    if (seenDate > lastSeenDate && seenDate - lastSeenDate > seenLimit) {
      await updateAllPackages(allPackagesFile, sha)
      lastSeenDate = Math.max(lastSeenDate, seenDate)
      fs.writeFileSync(lastSeenFile, commitDateStr + '\n')
    }
  }
  const [sha, ymd, hms, tzoff] = lastLine.split(' ')
  const commitDateStr = [ymd, hms, tzoff].join(' ')
  await updateAllPackages(allPackagesFile, sha)
  fs.writeFileSync(lastSeenFile, commitDateStr + '\n')
}

async function main() {
  try {
    await generateUpdate()
  } catch (error) {
    console.log(error)
  }
}

if (require.main) {
  main()
}
