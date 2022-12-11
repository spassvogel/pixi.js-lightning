import type { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const config: RollupOptions = {
  input: 'src/main.ts',
  output: {
    file: 'build/bundle.js',
    // format: 'commonjs'
    format: 'iife'
  },
  plugins: [
    copy({
      targets: [
        { src: 'public/**', dest: 'build' },
      ]
    }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
  ]
  // sourceMap: 'inline',
}
export default config;
