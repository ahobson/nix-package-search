import { createDbWorker } from 'sql.js-httpvfs'

export interface IPackage {
  id: string
  pname: string
  nixPackageName: string
  name: string
  version: string
  sha: string
}

export class PackageInfo {
  id: string
  pname: string
  nixPackageName: string
  name: string
  version: string
  sha: string

  constructor(
    pname: string,
    nixPackageName: string,
    name: string,
    version: string,
    sha: string
  ) {
    this.pname = pname
    this.nixPackageName = nixPackageName
    this.name = name
    this.version = version
    this.sha = sha
    this.id = [name, nixPackageName, pname, version].join('@')
  }
}

export function createPackageInfoFromCsvRow(row: string[]): PackageInfo {
  return new PackageInfo(row[0], row[1], row[2], row[3], row[4])
}

// sadly there's no good way to package workers and wasm directly so you need a way to get these two URLs from your bundler.
// This is the webpack5 way to create a asset bundle of the worker and wasm:
const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
)
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url)

const publicPath = process.env.PUBLIC_URL || ''
const dbWorker = createDbWorker(
  [
    {
      from: 'inline',
      config: {
        serverMode: 'full', // file is just a plain old full sqlite database
        requestChunkSize: 4096,
        url: `${publicPath}/nix/nixpkgs-unstable/all_packages.sqlite3`,
      },
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString()
)

function isIPackage(item: IPackage | undefined): item is IPackage {
  return !!item
}

interface QueryPackage {
  pname: string
  nix_package_name: string
  name: string
  version: string
  sha: string
}

function isQueryPackage(item: unknown): item is QueryPackage {
  if (typeof item !== 'object') {
    return false
  }
  if (item === null || item === undefined) {
    return false
  }
  return (
    'pname' in item &&
    'nix_package_name' in item &&
    'name' in item &&
    'version' in item &&
    'sha' in item
  )
}

function queryToIPackage(u: unknown): IPackage | undefined {
  if (!isQueryPackage(u)) {
    return undefined
  }
  return {
    id: u.pname + '/' + u.nix_package_name + '/' + u.name,
    pname: u.pname,
    nixPackageName: u.nix_package_name,
    name: u.name,
    version: u.version,
    sha: u.sha,
  }
}

export async function prefixSearch(prefix: string): Promise<IPackage[]> {
  return dbWorker.then(async (worker) => {
    return await worker.db
      .query(`SELECT * FROM packages WHERE name LIKE ? LIMIT 200`, [
        prefix + '%',
      ])
      .then((value) => {
        return value.map((v) => queryToIPackage(v)).filter(isIPackage)
      })
  })
}
