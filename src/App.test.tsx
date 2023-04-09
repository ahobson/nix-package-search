import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

vi.mock('./config/worker.ts', () => {
  return {
    getDbWorker: vi.fn(),
  }
})

import App from './App'

test('renders help text', () => {
  render(<App />)
  const header = screen.getByText(/Every night the list of packages/i)
  expect(header).toBeInTheDocument()
})
