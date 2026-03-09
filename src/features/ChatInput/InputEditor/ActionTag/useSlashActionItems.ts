import type { IEditor, SlashOptions } from '@lobehub/editor';
import Fuse from 'fuse.js';
import { $getSelection, $isRangeSelection } from 'lexical';
import {
  LanguagesIcon,
  NotebookPenIcon,
  PencilLineIcon,
  ShrinkIcon,
  SmilePlusIcon,
  SparklesIcon,
  UnfoldVerticalIcon,
} from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatInputStore } from '../../store';
import { INSERT_ACTION_TAG_COMMAND, type InsertActionTagPayload } from './command';
import { type ActionTagData, AI_ACTIONS, PROMPT_PRESETS } from './types';

type SlashItem = NonNullable<SlashOptions['items'] extends (infer U)[] ? U : never>;

interface SlashMenuOption {
  icon?: any;
  key: string;
  label: string;
  metadata?: Record<string, any>;
  onSelect?: (editor: IEditor, matchingString: string) => void;
}

const ACTION_ICONS: Record<string, any> = {
  changeTone: SmilePlusIcon,
  condense: ShrinkIcon,
  expand: UnfoldVerticalIcon,
  polish: SparklesIcon,
  rewrite: PencilLineIcon,
  summarize: NotebookPenIcon,
  translate: LanguagesIcon,
};

export const useSlashActionItems = (): SlashOptions['items'] => {
  const { t } = useTranslation('editor');
  const editorInstance = useChatInputStore((s) => s.editor);

  return useCallback(
    async (
      search: { leadOffset: number; matchingString: string; replaceableString: string } | null,
    ) => {
      const allItems: SlashItem[] = [];

      const makeItem = (action: ActionTagData): SlashMenuOption => ({
        icon: ACTION_ICONS[action.type],
        key: `action-${action.type}`,
        label: t(`slash.${action.type}` as any),
        metadata: { category: action.category, type: action.type },
        onSelect: (editor: IEditor) => {
          const payload: InsertActionTagPayload = {
            category: action.category,
            label: t(`slash.${action.type}` as any) as string,
            type: action.type,
          };
          editor.dispatchCommand(INSERT_ACTION_TAG_COMMAND, payload);
        },
      });

      // AI actions: only when slash trigger is at the beginning of a line
      let isAtLineStart = search === null;
      if (!isAtLineStart && editorInstance) {
        const lexicalEditor = editorInstance.getLexicalEditor();
        if (lexicalEditor) {
          lexicalEditor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const node = selection.anchor.getNode();
              const topElement = node.getTopLevelElement();
              if (topElement) {
                const paragraphText = topElement.getTextContent();
                const triggerAndSearch = '/' + (search?.matchingString || '');
                isAtLineStart = paragraphText === triggerAndSearch;
              }
            }
          });
        }
      }

      if (isAtLineStart) {
        for (const action of AI_ACTIONS) {
          allItems.push(makeItem(action) as SlashItem);
        }
        allItems.push({ type: 'divider' } as SlashItem);
      }

      // Prompt presets: always available
      for (const action of PROMPT_PRESETS) {
        allItems.push(makeItem(action) as SlashItem);
      }

      // Self-managed fuzzy filtering (SlashService skips Fuse for function items)
      if (search?.matchingString && search.matchingString.length > 0) {
        const searchable = allItems.filter((i) => !('type' in i) || (i as any).type !== 'divider');
        const fuse = new Fuse(searchable, { keys: ['key', 'label'], threshold: 0.4 });
        return fuse.search(search.matchingString).map((r) => r.item);
      }

      return allItems;
    },
    [t, editorInstance],
  );
};
