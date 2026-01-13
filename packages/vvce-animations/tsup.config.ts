import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  // Copy CSS files to dist
  onSuccess: async () => {
    const fs = await import('fs');
    const path = await import('path');

    // Copy animations.css to dist
    const cssSource = path.join(__dirname, 'src/web/animations.css');
    const cssDest = path.join(__dirname, 'dist/animations.css');

    if (fs.existsSync(cssSource)) {
      fs.copyFileSync(cssSource, cssDest);
      console.log('✓ Copied animations.css to dist/');
    }
  },
});
