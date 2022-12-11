import type { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';

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
    serve({
      open: true,
      contentBase: 'build',
    })
  ]
  // sourceMap: 'inline',
}
export default config;
