import { defineConfig } from 'tsup';

export default defineConfig([
  // Library builds (CJS, ESM)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['*.css'],
    loader: {
      '.css': 'text',
    },
  },
  // Browser build (IIFE for global usage)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'VVCEAnimations',
    outDir: 'dist/browser',
    minify: true,
    sourcemap: true,
    external: ['*.css'],
    loader: {
      '.css': 'text',
    },
  },
]);
