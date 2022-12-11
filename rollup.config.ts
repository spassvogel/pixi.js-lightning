import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  // entry: 'src/scripts/main.js',
  // dest: 'build/js/main.min.js',
  // format: 'iife',
  input: 'src/main.ts',
  output: {
    file: 'build/bundle.js',
    format: 'cjs'
  },
  // sourceMap: 'inline',
}
export default config;
