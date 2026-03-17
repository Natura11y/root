import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === 'build'
      ? [dts({
          include: ['src/components/natura11y', 'src/hooks', 'src/types'],
          outDir: 'dist/types'
        })]
      : [])
  ],
  server: {
    port: 3000,
    open: true
  },
  // Allow plain .js files with JSX syntax (legacy components not yet converted to .jsx/.tsx).
  // Scoped to dev only — the lib build handles TypeScript natively.
  ...(command === 'serve' && {
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    }
  }),
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  ...(command === 'build' && {
    build: {
      lib: {
        entry: {
          'natura11y-react': 'src/components/natura11y/index.jsx',
          'hooks': 'src/hooks/index.ts'
        },
        formats: ['es', 'cjs'],
        fileName: (format, entryName) =>
          format === 'es'
            ? `${entryName}.js`
            : `${entryName}.cjs`
      },
      rollupOptions: {
        external: (id) =>
          ['react', 'react-dom', 'react/jsx-runtime'].includes(id) ||
          id === 'natura11y' ||
          id.startsWith('natura11y/'),
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
            'natura11y': 'Natura11y'
          }
        }
      }
    }
  })
}))
