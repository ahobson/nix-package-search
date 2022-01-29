import { render, screen } from '@testing-library/react'
jest.mock('./config/worker.ts', () => {
  return {
    getDbWorker: jest.fn(),
  }
})

import App from './App'

test('renders help text', () => {
  render(<App />)
  const header = screen.getByText(/Every night the list of packages/i)
  expect(header).toBeInTheDocument()
})
