import type { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import watch from "rollup-plugin-watch";

const config: RollupOptions = {
  input: 'src/main.ts',
  output: {
    file: 'build/bundle.js',
    // format: 'commonjs'
    format: 'iife'
  },
  plugins: [
    typescript(),
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
    }),
    watch({ dir: "public" })
  ]
  // sourceMap: 'inline',
}
export default config;
