// put these in their own file so they can be mocked for testing
// jest doesn't handle import.meta yet

import { createDbWorker } from 'sql.js-httpvfs'
import { SplitFileConfigInner } from 'sql.js-httpvfs/dist/sqlite.worker'

// sadly there's no good way to package workers and wasm directly so
// you need a way to get these two URLs from your bundler.
// This is the webpack5 way to create a asset bundle of the worker and wasm:
const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
)

const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url)

const publicPath = import.meta.env.BASE_URL || ''
const gitSha: string = import.meta.env.VITE_GITHUB_SHA || 'local'
const r = await fetch(
  `${publicPath}nix/nixpkgs-unstable/all_packages.sqlite3`,
  {
    method: 'HEAD',
  }
)

const contentLength = parseInt(r.headers.get('content-length') || '0')

const config: SplitFileConfigInner = (() => {
  const url = `${publicPath}nix/nixpkgs-unstable/all_packages.sqlite3`
  if (contentLength > 0) {
    const c: SplitFileConfigInner = {
      requestChunkSize: 4096,
      cacheBust: gitSha,
      serverMode: 'chunked', // file is just a plain old full sqlite database
      urlPrefix: url,
      databaseLengthBytes: contentLength,
      serverChunkSize: contentLength,
      suffixLength: 0,
    }
    return c
  }
  return {
    serverMode: 'full',
    requestChunkSize: 4096,
    url,
    cacheBust: gitSha,
  }
})()

const dbWorker = createDbWorker(
  [
    {
      from: 'inline',
      config,
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString()
)

export function getDbWorker() {
  return dbWorker
}
