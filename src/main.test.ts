import { expect, test, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

vi.mock('./config/worker.ts', () => {
  return {
    getDbWorker: vi.fn(),
  }
})

test('main document', async () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8')
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: `file://${path.resolve(__dirname, '..')}/public/index.html`,
  })

  const { document } = dom.window

  const noscript = document.querySelector<HTMLDivElement>('#noscript')
  expect(noscript).toBeTruthy()
  expect(noscript!.getAttribute('hidden')).toBeFalsy()

  expect(document.querySelector<HTMLDivElement>('#menu')).toBeTruthy()
  expect(document.querySelector<HTMLDivElement>('#search')).toBeTruthy()
})
