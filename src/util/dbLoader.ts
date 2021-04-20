import * as Papa from 'papaparse'
import { Dexie } from 'dexie'

import {
  NixPackagesDatabase,
  createPackageInfoFromCsvRow,
} from './../config/DBConfig'
import { SendNixMessageFunction } from './../config/messages'

const ALL_PACKAGES = '/nix/nixpkgs-unstable/all_packages.csv'
const PACKAGES_URL = process.env.PUBLIC_URL + ALL_PACKAGES

export type RemoteMetadata = {
  packageSize: number
  lastModifiedAt: number
}

export async function getRemoteMetadata(): Promise<RemoteMetadata | undefined> {
  // first use HEAD to get the content length
  const response = await fetch(PACKAGES_URL, { method: 'HEAD' })
  const clString = response.headers.get('content-length')
  const lmString = response.headers.get('last-modified')
  if (clString && lmString) {
    return {
      packageSize: parseInt(clString),
      lastModifiedAt: Date.parse(lmString),
    }
  }
  return undefined
}

export async function parseAndLoad(
  db: NixPackagesDatabase,
  callback: SendNixMessageFunction
) {
  const bulkOperations: Promise<void>[] = []

  Papa.parse<string>(PACKAGES_URL, {
    download: true,
    fastMode: true,
    skipEmptyLines: true,
    chunkSize: 1024 * 1024,
    chunk: async function (results) {
      const chunkData = (results.data as any) as string[][]
      bulkOperations.push(
        db.packages
          .bulkPut(chunkData.map((r) => createPackageInfoFromCsvRow(r)))
          .then((_) => callback({ cursor: results.meta.cursor }))
          .catch(Dexie.BulkError, function (e) {
            console.log('Bulk error', e)
          })
      )
    },
    complete: function () {
      bulkOperations
        .reduce(async (p, nextP) => {
          return p.then(() => {
            return nextP
          })
        }, Promise.resolve())
        .then((_) => {
          bulkOperations.length = 0
          callback({ finished: true })
        })
        .catch((err) => {
          console.log('complete error', err)
        })
    },
    error: function (err) {
      console.log('CSV parse error', err)
    },
  })
}
