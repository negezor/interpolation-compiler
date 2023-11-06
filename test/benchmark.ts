import { Bench } from 'tinybench';

import { compileReplaceBackend, compileSliceBackend, compileFnBackend } from '..';

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

const HTML_TAGS = '<meta bla-bla-bla="1>bla-bla-bla-bla</meta>'.repeat(10);

const array = new Uint32Array(10000);
crypto.getRandomValues(array);

// We emulate app payload
const APP_HTML = Array.from(array, (dec) => dec.toString(16).padStart(2, '0')).join('');

const bench = new Bench({
    time: 1000,
    warmupTime: 100,
});

const placeholders = {
    htmlAttrs: 'html="attrs"',
    bodyAttrs: 'body="attrs"',
    headTags: '<!--head-tags-->',
    preloadLinksTags: '<!--preload-links-->',
    bodyTags: '<!--body-tags-->',
    teleportTags: '<!--teleport-overlay-->',
    appHtml: '<!--app-html-->',
};

const interpolationReplaceBackend = compileReplaceBackend(HTML_TEMPLATE, {
    placeholders,
});

const interpolationSliceBackend = compileSliceBackend(HTML_TEMPLATE, {
    placeholders,
});

const interpolationFnBackend = compileFnBackend(HTML_TEMPLATE, {
    placeholders,
});

bench
    .add('string.replace()', () => {
        return HTML_TEMPLATE
            .replace('html="attrs"', 'attr1="1" attr2="2"')
            .replace('body="attrs"', 'attr1="1" attr2="2"')
            .replace('<!--head-tags-->', HTML_TAGS)
            .replace('<!--preload-links-->', HTML_TAGS)
            .replace('<!--body-tags-->', HTML_TAGS)
            .replace('<!--teleport-overlay-->', HTML_TAGS)
            // It would be maximally dishonest if we put this higher
            .replace('<!--app-html-->', APP_HTML);
    })
    .add('string.replaceAll()', () => {
        return HTML_TEMPLATE
            .replaceAll('html="attrs"', 'attr1="1" attr2="2"')
            .replaceAll('body="attrs"', 'attr1="1" attr2="2"')
            .replaceAll('<!--head-tags-->', HTML_TAGS)
            .replaceAll('<!--preload-links-->', HTML_TAGS)
            .replaceAll('<!--body-tags-->', HTML_TAGS)
            .replaceAll('<!--teleport-overlay-->', HTML_TAGS)
            // It would be maximally dishonest if we put this higher
            .replaceAll('<!--app-html-->', APP_HTML);
    })
    .add('replace backend', () => {
        return interpolationReplaceBackend({
            htmlAttrs: 'attr1="1" attr2="2"',
            bodyAttrs: 'attr1="1" attr2="2"',
            headTags: HTML_TAGS,
            preloadLinksTags: HTML_TAGS,
            bodyTags: HTML_TAGS,
            teleportTags: HTML_TAGS,
            appHtml: APP_HTML,
        });
    })
    .add('slice backend', () => {
        return interpolationSliceBackend({
            htmlAttrs: 'attr1="1" attr2="2"',
            bodyAttrs: 'attr1="1" attr2="2"',
            headTags: HTML_TAGS,
            preloadLinksTags: HTML_TAGS,
            bodyTags: HTML_TAGS,
            teleportTags: HTML_TAGS,
            appHtml: APP_HTML,
        });
    })
    .add('fn backend', () => {
        return interpolationFnBackend({
            htmlAttrs: 'attr1="1" attr2="2"',
            bodyAttrs: 'attr1="1" attr2="2"',
            headTags: HTML_TAGS,
            preloadLinksTags: HTML_TAGS,
            bodyTags: HTML_TAGS,
            teleportTags: HTML_TAGS,
            appHtml: APP_HTML,
        });
    });

bench.run()
    .then(() => {
        console.table(bench.table());
    })
    .catch(console.error);

