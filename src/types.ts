export type RenderData<K extends string> = Record<K, string>;

export type Render<K extends string> = (data: RenderData<K>) => string;

export type Placeholders<K extends string> = Record<K, string>;
