export type ActionTagCategory = 'ai' | 'prompt';

export type ActionTagType =
  | 'changeTone'
  | 'condense'
  | 'expand'
  | 'polish'
  | 'rewrite'
  | 'summarize'
  | 'translate';

export interface ActionTagData {
  category: ActionTagCategory;
  label: string;
  type: ActionTagType;
}

export const AI_ACTIONS: ActionTagData[] = [
  { category: 'ai', label: 'translate', type: 'translate' },
  { category: 'ai', label: 'summarize', type: 'summarize' },
  { category: 'ai', label: 'rewrite', type: 'rewrite' },
];

export const PROMPT_PRESETS: ActionTagData[] = [
  { category: 'prompt', label: 'polish', type: 'polish' },
  { category: 'prompt', label: 'expand', type: 'expand' },
  { category: 'prompt', label: 'condense', type: 'condense' },
  { category: 'prompt', label: 'changeTone', type: 'changeTone' },
];
