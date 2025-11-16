// put these in their own file so they can be mocked for testing
// jest doesn't handle import.meta yet

import { createSQLiteThread, createHttpBackend } from 'sqlite-wasm-http'

const publicPath = import.meta.env.BASE_URL || ''
const remoteURL = `${publicPath}nix/nixpkgs-unstable/all_packages.sqlite3`

const httpBackend = createHttpBackend({
  maxPageSize: 1024, // this is the current default SQLite page size
  timeout: 10000, // 10s
  cacheSize: 4096, // 4 MB
})

export async function query(sql: string, bind: object): Promise<any[]> {
  const db = await createSQLiteThread({ http: httpBackend })
  // This API is compatible with all SQLite VFS
  await db('open', { filename: 'file:' + encodeURI(remoteURL), vfs: 'http' })
  const rows: any[] = []
  await db('exec', {
    sql,
    bind,
    rowMode: 'object',
    callback: (msg: any) => {
      if (msg.row) {
        rows.push(msg.row)
      }
    },
  })
  // This closes the DB connection
  await db('close', {})
  db.close()
  await httpBackend.close()

  return rows
}
