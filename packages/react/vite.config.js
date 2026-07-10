import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isDemoBuild = mode === 'demo'
  const isPackageBuild = command === 'build' && !isDemoBuild

  return {
    resolve: {
      alias: {
        '@lib': path.resolve('./src'),
      }
    },
    plugins: [
      react(),
      ...(isPackageBuild
        ? [dts({
            include: ['src/components', 'src/context', 'src/hooks', 'src/types'],
            exclude: [
              'src/components/accordion/AccordionContext.ts',
              'src/components/alert/AlertParent.tsx',
              'src/components/form/FormValidation.tsx',
              'src/components/lightbox/ImageWithLoading.tsx',
              'src/components/lightbox/LightboxExample.tsx',
              'src/components/modal/ModalParent.tsx',
              'src/components/tab/TabContext.ts',
              'src/components/table/tableData.ts'
            ]
          })]
        : [])
    ],
    server: {
      port: 3000,
      open: true
    },
    // Allow plain .js files with JSX syntax (legacy components not yet converted to .jsx/.tsx).
    // Scoped to dev only; the lib build handles TypeScript natively.
    ...(command === 'serve' && {
      optimizeDeps: {
        rolldownOptions: {
          moduleTypes: {
            '.js': 'jsx'
          }
        }
      }
    }),
    ...(isDemoBuild && {
      build: {
        outDir: 'demo-dist'
      }
    }),
    ...(isPackageBuild && {
      build: {
        copyPublicDir: false,
        emptyOutDir: true,
        lib: {
          entry: {
            'natura11y-react': 'src/components/index.ts',
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
            id === '@natura11y/core' ||
            id.startsWith('@natura11y/core/'),
          output: {
            globals: {
              'react': 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'ReactJSXRuntime',
              '@natura11y/core': 'Natura11yCore'
            }
          }
        }
      }
    })
  }
})
