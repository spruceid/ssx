import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/**/*'],
    clean: true,
    format: ['esm', 'cjs'],
    dts: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
    outExtension({ format }) {
      return {
        js: `.${format}.js`,
      };
    },
  },
]);
