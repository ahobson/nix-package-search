import { query } from './worker'

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

function queryToIPackage(u: any): IPackage | undefined {
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
  return query(
    `SELECT * FROM packages WHERE name LIKE $name_pattern OR nix_package_name LIKE $package_name_pattern LIMIT 200`,
    { $name_pattern: prefix + '%', $package_name_pattern: prefix + '%' }
  )
    .then((rows) => {
      return rows.map((r) => queryToIPackage(r)).filter(isIPackage)
    })
    .catch((e) => {
      return []
    })
}
