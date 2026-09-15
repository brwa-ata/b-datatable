import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [vue(), ...(!isLib ? [vueDevTools()] : []), ...(isLib ? [cssInjectedByJsPlugin()] : [])],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: isLib
      ? {
          lib: {
            entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.js'),
            name: 'BDatatable',
            fileName: 'b-datatable',
            cssFileName: 'b-datatable',
          },
          cssCodeSplit: false,
          rollupOptions: {
            // b-date-input is a peer dependency: keep it out of the bundle so the host
            // project's own copy (and its own stylesheet / theme) is used.
            external: ['vue', 'b-date-input'],
            output: {
              exports: 'named',
              globals: {
                vue: 'Vue',
                'b-date-input': 'VueDateInput',
              },
              assetFileNames: 'b-datatable.[ext]',
            },
          },
        }
      : {},
  }
})
