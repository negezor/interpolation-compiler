import type { Placeholders, Render } from '../types.js';

const TEMPLATE_QUOTE_RE = /`/gm;

export interface CompileFnBackendOptions<K extends string> {
    placeholders: Placeholders<K>;
}

export function compileFnBackend<K extends string>(template: string, options: CompileFnBackendOptions<K>): Render<K> {
    const placeholderEntries = Object.entries(options.placeholders) as [K, string][];

    // OPTIMIZE: If you don't need to change anything, just return the string
    if (placeholderEntries.length === 0) {
        return () => template;
    }

    let newTemplate = `\`${template.replace(TEMPLATE_QUOTE_RE, '\\`')}\``;

    for (const [key, value] of placeholderEntries) {
        newTemplate = newTemplate.replaceAll(value, `\${data.${key}}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return Function('data', `return ${newTemplate}`) as Render<K>;
}