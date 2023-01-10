import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*'],
  clean: true,
  format: ['esm', 'cjs'],
  legacyOutput: true,
  dts: {
    compilerOptions: {
      jsx: 'react-jsx',
    },
  },
});
