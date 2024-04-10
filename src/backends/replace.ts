import type { Placeholders, Render } from '../types.js';

export interface CompileReplaceBackendOptions<K extends string> {
    placeholders: Placeholders<K>;
}

export function compileReplaceBackend<K extends string>(
    template: string,
    options: CompileReplaceBackendOptions<K>,
): Render<K> {
    const placeholderEntries = Object.entries(options.placeholders) as [K, string][];

    const existingPlaceholder = placeholderEntries.filter(([, search]) => template.includes(search));

    // OPTIMIZE: If you don't need to change anything, just return the string
    if (existingPlaceholder.length === 0) {
        return () => template;
    }

    return data => {
        let renderedTemplate = template;

        for (const [key, search] of existingPlaceholder) {
            renderedTemplate = renderedTemplate.replaceAll(search, data[key]);
        }

        return renderedTemplate;
    };
}
