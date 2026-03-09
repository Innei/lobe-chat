import { Tag, Tooltip } from '@lobehub/ui';
import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, type LexicalEditor } from 'lexical';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { ActionTagNode } from './ActionTagNode';
import { useStyles } from './style';

interface ActionTagProps {
  editor: LexicalEditor;
  label: string;
  node: ActionTagNode;
}

const ActionTag = memo<ActionTagProps>(({ node, editor, label }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { styles, cx } = useStyles();
  const { t } = useTranslation('editor');

  const isAI = node.actionCategory === 'ai';
  const categoryLabel = t(isAI ? 'actionTag.category.ai' : 'actionTag.category.prompt');

  const onClick = useCallback((payload: MouseEvent) => {
    if (payload.target === spanRef.current || spanRef.current?.contains(payload.target as Node)) {
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    return editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW);
  }, [editor, onClick]);

  return (
    <span className={cx('editor_action_tag', isAI ? styles.aiTag : styles.promptTag)} ref={spanRef}>
      <Tooltip
        title={
          <div>
            <div style={{ fontWeight: 500 }}>{label}</div>
            <div>{categoryLabel}</div>
          </div>
        }
      >
        <Tag color={isAI ? 'blue' : 'green'} variant="filled">
          {label}
        </Tag>
      </Tooltip>
    </span>
  );
});

ActionTag.displayName = 'ActionTag';

export default ActionTag;
