import { defineConfig } from 'rollup';
import typescriptPlugin from 'rollup-plugin-typescript2';

import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join as pathJoin } from 'node:path';

const cacheRoot = pathJoin(tmpdir(), '.rpt2_cache');

const rootDir = pathJoin(fileURLToPath(import.meta.url), '..');

const src = pathJoin(rootDir, 'src');
const lib = pathJoin(rootDir, 'lib');

export default defineConfig({
    input: pathJoin(src, 'index.ts'),
    plugins: [
        typescriptPlugin({
            cacheRoot,

            useTsconfigDeclarationDir: false,

            tsconfigOverride: {
                outDir: lib,
                rootDir: src,
                include: [src],
            },
        }),
    ],
    output: [
        {
            file: pathJoin(lib, 'index.js'),
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pathJoin(lib, 'index.mjs'),
            format: 'esm',
        },
    ],
});
