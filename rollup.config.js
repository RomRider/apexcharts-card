import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

// eslint-disable-next-line no-undef
const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    babelrc: false,
    presets: [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        targets: '> 0.25%, not dead',
      },
    ],
  }),
  dev && serve(serveopts),
  !dev &&
    terser({
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      },
    }),
];

export default [
  {
    input: 'src/apexcharts-card.ts',
    output: {
      dir: './dist',
      format: 'es',
      sourcemap: dev ? true : false,
    },
    plugins: [...plugins],
    watch: {
      exclude: 'node_modules/**',
    },
    globals: {
      apexcharts: 'ApexCharts',
    },
  },
];
