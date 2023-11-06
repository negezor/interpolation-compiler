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

const htmlPlaceholders = {
    htmlAttrs: 'html="attrs"',
    bodyAttrs: 'body="attrs"',
    headTags: '<!--head-tags-->',
    preloadLinksTags: '<!--preload-links-->',
    bodyTags: '<!--body-tags-->',
    teleportTags: '<!--teleport-overlay-->',
    appHtml: '<!--app-html-->',
};

const DESIRED_TEMPLATE = `
    <!DOCTYPE html>
    <html ~~htmlAttrs~~>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ~~headTags~~
        ~~preloadLinksTags~~
    </head>
    <body ~~bodyAttrs~~>
        <div id="app">~~appHtml~~</div>
        ~~bodyTags~~
        ~~teleportTags~~
    </body>
    </html>
`;

const desiredRenderData = {
    htmlAttrs: '~~htmlAttrs~~',
    bodyAttrs: '~~bodyAttrs~~',
    headTags: '~~headTags~~',
    preloadLinksTags: '~~preloadLinksTags~~',
    bodyTags: '~~bodyTags~~',
    teleportTags: '~~teleportTags~~',
    appHtml: '~~appHtml~~',
};

describe('Backends', (): void => {
    it('compileReplaceBackend should render the template correctly', () => {
        const render = compileReplaceBackend(HTML_TEMPLATE, {
            placeholders: htmlPlaceholders,
        });
        const result = render({ ...desiredRenderData });
        expect(result).toEqual(DESIRED_TEMPLATE);
    });

    it('compileFnBackend should render the template correctly', () => {
        const render = compileFnBackend(HTML_TEMPLATE, {
            placeholders: htmlPlaceholders,
        });
        const result = render({ ...desiredRenderData });
        expect(result).toEqual(DESIRED_TEMPLATE);
    });

    it('compileSliceBackend should render the template correctly', () => {
        const render = compileSliceBackend(HTML_TEMPLATE, {
            placeholders: htmlPlaceholders,
        });
        const result = render({ ...desiredRenderData });
        expect(result).toEqual(DESIRED_TEMPLATE);
    });
});
