import { Dexie } from 'dexie'

export interface IMetadata {
  id: number
  lastModifiedAt: number
  size: number
}

export interface IPackage {
  id: string
  pname: string
  nixPackageName: string
  name: string
  version: string
  sha: string
}

export class Metadata {
  id: number
  lastModifiedAt: number
  size: number

  constructor(lastModifiedAt: number, size: number) {
    this.lastModifiedAt = lastModifiedAt
    this.size = size
    // storing a single metadata
    this.id = 0
  }
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

export class NixPackagesDatabase extends Dexie {
  metadata: Dexie.Table<IMetadata, number>
  packages: Dexie.Table<IPackage, number>

  constructor() {
    super('NixPackages')
    this.version(1).stores({
      metadata: 'id, lastModifiedAt, size',
      packages: 'id, name, pname, nixPackageName',
    })

    this.metadata = this.table('metadata')
    this.packages = this.table('packages')
  }
}

export const db = new NixPackagesDatabase()

export async function getLastModifiedAt(): Promise<number | undefined> {
  const allMetadata = await db.metadata.limit(1).toArray()
  if (allMetadata && allMetadata.length === 1) {
    return allMetadata[0].lastModifiedAt
  }
  return undefined
}
export async function setMetadata(metadata: Metadata): Promise<void> {
  await db.metadata.put(metadata)
}

export async function prefixSearch(prefix: string): Promise<IPackage[]> {
  return await db.packages
    .where('name')
    .startsWithIgnoreCase(prefix)
    .limit(200)
    .filter((row) => !row.nixPackageName.includes('.'))
    .toArray()
}
