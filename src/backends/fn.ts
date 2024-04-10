import type { Placeholders, Render } from '../types.js';

const TEMPLATE_QUOTE_RE = /`/gm;

export interface CompileFnBackendOptions<K extends string> {
    placeholders: Placeholders<K>;
}

export function compileFnBackend<K extends string>(template: string, options: CompileFnBackendOptions<K>): Render<K> {
    const placeholderEntries = Object.entries(options.placeholders) as [K, string][];

    const existingPlaceholder = placeholderEntries.filter(([, search]) => template.includes(search));

    // OPTIMIZE: If you don't need to change anything, just return the string
    if (existingPlaceholder.length === 0) {
        return () => template;
    }

    let newTemplate = `\`${template.replace(TEMPLATE_QUOTE_RE, '\\`')}\``;

    for (const [key, value] of existingPlaceholder) {
        newTemplate = newTemplate.replaceAll(value, `\${data['${key}']}`);
    }

    return Function('data', `return ${newTemplate}`) as Render<K>;
}
