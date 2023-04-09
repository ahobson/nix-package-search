// put these in their own file so they can be mocked for testing
// jest doesn't handle import.meta yet

import { createDbWorker } from 'sql.js-httpvfs'

// sadly there's no good way to package workers and wasm directly so
// you need a way to get these two URLs from your bundler.
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
        url: `${publicPath}nix/nixpkgs-unstable/all_packages.sqlite3`,
      },
    },
  ],
  workerUrl.toString(),
  wasmUrl.toString()
)

export function getDbWorker() {
  return dbWorker
}
