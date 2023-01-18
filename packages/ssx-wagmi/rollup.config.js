import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  context: 'window',
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    // typescript(),
  ],
};
