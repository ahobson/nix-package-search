/// <reference types="vitest" />
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/nix-package-search/',
  plugins: [svgLoader(), wasm()],
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    //   setupFiles: ['./src/setupTests.ts'],
  },
})
