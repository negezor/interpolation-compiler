<p align="center">
<a href="https://www.npmjs.com/package/interpolation-compiler"><img src="https://img.shields.io/npm/v/interpolation-compiler.svg?style=flat-square" alt="NPM version"></a>
<a href="https://github.com/negezor/interpolation-compiler/actions/workflows/tests.yml"><img src="https://img.shields.io/github/actions/workflow/status/negezor/interpolation-compiler/tests.yml?style=flat-square" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/interpolation-compiler"><img src="https://img.shields.io/npm/dt/interpolation-compiler.svg?style=flat-square" alt="NPM downloads"></a>
</p>

**interpolation-compiler** - Compiles a placeholder-based template to use string interpolation

| 📖 [Documentation](docs/) |
|---------------------------|

## Features

1. **Self-Sufficient.** The library has zero dependencies
2. **Reliable.** The library is written in **TypeScript** and covered by tests.
3. **Modern.** The library comes with native ESM support
4. **Fast.** See benchmarks below

## Installation
> **[Node.js](https://nodejs.org/) 20.0.0 or newer is required**

- **Using `npm`** (recommended)
    ```shell
    npm i interpolation-compiler
    ```
- **Using `Yarn`**
  ```shell
  yarn add interpolation-compiler
  ```
- **Using `pnpm`**
  ```shell
  pnpm add interpolation-compiler
  ```

## Example usage
```ts
import { compileSliceBackend } from 'interpolation-compiler';

const HTML_TEMPLATE = `
    <!DOCTYPE html>
    <html html="attrs">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!--head-tags-->
        <!--preload-links-->
    </head>
    <body body="attrs">
        <div id="app"><!--app-html--></div>
        <!--body-tags-->
        <!--teleport-overlay-->
    </body>
    </html>
`;

const render = compileSliceBackend(HTML_TEMPLATE, {
    placeholders: {
        htmlAttrs: 'html="attrs"',
        bodyAttrs: 'body="attrs"',
        headTags: '<!--head-tags-->',
        preloadLinksTags: '<!--preload-links-->',
        bodyTags: '<!--body-tags-->',
        teleportTags: '<!--teleport-overlay-->',
        appHtml: '<!--app-html-->',
    },
});

// Just vague data for clarity :D
const result = render({
    htmlAttrs: '~~htmlAttrs~~',
    bodyAttrs: '~~bodyAttrs~~',
    headTags: '~~headTags~~',
    preloadLinksTags: '~~preloadLinksTags~~',
    bodyTags: '~~bodyTags~~',
    teleportTags: '~~teleportTags~~',
    appHtml: '~~appHtml~~',
});

console.log(result);

// <!DOCTYPE html>
// <html ~~htmlAttrs~~>
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     ~~headTags~~
//     ~~preloadLinksTags~~
// </head>
// <body ~~bodyAttrs~~>
//     <div id="app">~~appHtml~~</div>
//     ~~bodyTags~~
//     ~~teleportTags~~
// </body>
// </html>
```

## Why

> Why not take mustache?

I need an arbitrary search pattern for the replacement.

> Why not just use `.replace()` or `.replaceAll()`?

It's slow, well almost... I know the pattern in advance and it will be called many times to replace for a large number of patterns. The big problem is the memory and CPU consumption when dealing with large strings, as the string gets bigger and bigger after replacement.

> Why might it be unsafe?

Only template replacement is performed here, no escape html or other filters are applied. And maybe you should avoid compileFnBackend in unknown templates, as it will essentially compile a function, which is comparable to eval.

## Benchmarks

- **Machine:** WSL 2 Arch Linux 5.15 | AMD Ryzen 9 3900X (24) @ 3.800GHz | Memory: 32GB
- **Node:** `v21.1.0`
- **Run:** 2023-11-06 03:01:26
- **Method:** `npm run benchmark` (100ms warmup, 1000ms measure)

```sh
┌─────────┬───────────────────────┬─────────────┬────────────────────┬──────────┬─────────┐
│ (index) │       Task Name       │   ops/sec   │ Average Time (ns)  │  Margin  │ Samples │
├─────────┼───────────────────────┼─────────────┼────────────────────┼──────────┼─────────┤
│    0    │  'string.replace()'   │  '302,219'  │ 3308.857712918451  │ '±0.83%' │ 302220  │
│    1    │ 'string.replaceAll()' │  '233,923'  │ 4274.895004354919  │ '±0.54%' │ 233924  │
│    2    │   'replace backend'   │  '228,054'  │ 4384.916371057442  │ '±0.57%' │ 228055  │
│    3    │    'slice backend'    │ '4,342,870' │ 230.26243492081838 │ '±0.73%' │ 4342871 │
│    4    │     'fn backend'      │ '8,637,111' │ 115.7794436350917  │ '±0.92%' │ 8637112 │
└─────────┴───────────────────────┴─────────────┴────────────────────┴──────────┴─────────┘
```
