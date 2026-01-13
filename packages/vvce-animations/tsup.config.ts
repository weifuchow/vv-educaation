import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['*.css'],
  // Enable CSS handling
  loader: {
    '.css': 'text',
  },
});
