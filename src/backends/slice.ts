import type { Placeholders, Render } from '../types.js';

enum EntityType {
    Text = 0,
    Variable = 1,
}

interface TextEntity {
    type: EntityType.Text;
    text: string;
}

interface VariableEntity<K extends string> {
    type: EntityType.Variable;
    key: K;
}

type Entity<K extends string> = TextEntity | VariableEntity<K>;

export interface CompileSliceBackendOptions<K extends string> {
    placeholders: Placeholders<K>;
}

export function compileSliceBackend<K extends string>(template: string, options: CompileSliceBackendOptions<K>): Render<K> {
    const placeholderEntries = Object.entries(options.placeholders) as [K, string][];

    const placeholderIndexes: [key: K, [start: number, end: number]][] = [];

    for (const [key, search] of placeholderEntries) {
        let i = -1;

        // biome-ignore lint/suspicious/noAssignInExpressions: compact expression
        while ((i = template.indexOf(search, i + 1)) !== -1){
            placeholderIndexes.push([key, [i, i + search.length]]);
        }
    }

    // OPTIMIZE: If you don't need to change anything, just return the string
    if (placeholderIndexes.length === 0) {
        return () => template;
    }

    placeholderIndexes.sort(([, a], [, b]) => (
        a[0] - b[0]
    ));

    const entities: Entity<K>[] = [];

    let lastIndex = 0;
    for (const [key, [start, end]] of placeholderIndexes) {
        if (start > lastIndex) {
            entities.push({
                type: EntityType.Text,
                text: template.slice(lastIndex, start),
            });
        }

        entities.push({
            type: EntityType.Variable,
            key: key,
        });

        lastIndex = end;
    }

    if (lastIndex < template.length) {
        entities.push({
            type: EntityType.Text,
            text: template.slice(lastIndex),
        });
    }

    return (data) => {
        let renderedTemplate = '';

        for (const entity of entities) {
            if (entity.type === EntityType.Text) {
                renderedTemplate += entity.text;

                continue;
            }

            if (entity.type === EntityType.Variable) {
                renderedTemplate += data[entity.key];

                continue;
            }

            throw new Error('Unimplemented entity type');
        }

        return renderedTemplate;
    };
}
