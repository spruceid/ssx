import { defineBuildConfig } from 'unbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const entries = [
  'src/index.ts',
  'src/siwe.ts',
  //   'next-auth/frontend.ts',
];

const backEndEntryPoints = ['next-auth/backend.ts'];



export default defineBuildConfig({
    entries,
    outDir: 'build',
    declaration: true,
    clean: true,
    rollup: {
     resolve: true,
      commonjs: true,
      dts: {
        compilerOptions: {
          jsx: 'react-jsx',
        },
      },
    }
})