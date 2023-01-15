import type { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import watch from "rollup-plugin-watch";

const sourcemapEnabled = true
const config: RollupOptions = {
  input: 'src/main.ts',
  output: {
    file: 'build/bundle.js',
    sourcemap: sourcemapEnabled,
    // format: 'commonjs'
    format: 'iife'
  },
  plugins: [
    typescript({
      sourceMap: sourcemapEnabled,
    }),
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
}
export default config;
