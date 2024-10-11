/// <reference types="vitest" />
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/nix-package-search/',
  plugins: [svgLoader()],
  test: {
    environment: 'jsdom',
    //   setupFiles: ['./src/setupTests.ts'],
  },
})
