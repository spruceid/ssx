import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const frontEndEntryPoints = [
  'src/index.ts',
  'src/siwe.ts',
  //   'next-auth/frontend.ts',
];

const backEndEntryPoints = ['next-auth/backend.ts'];

export default [
  {
    input: frontEndEntryPoints,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
      },
    ],
    context: 'window',
    plugins: [
      nodeResolve({
        browser: true,
      }),
      commonjs(),
      typescript(),
    ],
  },
//   {
//     input: frontEndEntryPoints,
//     output: [
//       {
//         dir: 'dist',
//         format: 'esm',
//       },
//     ],
//     context: 'window',
//     plugins: [
//       nodeResolve({
//         browser: true,
//       }),
//       commonjs(),
//       typescript(),
//     ],
//   },

  //   {
  //     input: backEndEntryPoints,
  //     output: [
  //       {
  //         dir: 'dist',
  //         format: 'esm',
  //       },
  //       {
  //         dir: 'dist',
  //         format: 'cjs',
  //       },
  //     ],
  //     context: 'this',
  //     plugins: [
  //       nodeResolve({
  //         browser: false,
  //       }),
  //       commonjs(),
  //       typescript(),
  //     ],
  //   },
];
