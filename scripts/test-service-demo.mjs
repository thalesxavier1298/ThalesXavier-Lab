import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const outfile = resolve('node_modules/.cache/test-service-demo.mjs');
await build({ entryPoints: ['scripts/service-demo-cases.jsx'], bundle: true, platform: 'node', format: 'esm', packages: 'external', outfile });
await import(pathToFileURL(outfile).href);
