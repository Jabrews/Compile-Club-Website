/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import history from 'connect-history-api-fallback'
import type { Connect } from 'vite' // this gives access to the proper types

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use(
          history() as Connect.NextHandleFunction
        )
      }
    }
  ],
  build: {
    outDir: 'dist'
  }
})