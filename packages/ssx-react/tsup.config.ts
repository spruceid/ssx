import { defineConfig } from 'tsup';

const entrypoints = [
  'src/next-auth/frontend.ts',
  'src/next-auth/backend.ts',
  'src/siwe.ts',
];

export default defineConfig([
  {
    entry: [...entrypoints, 'src/index.ts'],
    clean: true,
    format: ['esm'],
    shims: true,
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
  {
    entry: [...entrypoints, 'src/index.cjs.ts'],
    // clean: true,
    format: ['cjs'],
    // dts: {
    //   compilerOptions: {
    //     jsx: 'react-jsx',
    //   },
    // },
    outExtension({ format }) {
      return {
        js: `.js`,
      };
    },
  },
]);
