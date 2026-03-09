import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  aiTag: css`
    cursor: default;
    user-select: none;
    display: inline-flex;

    &.selected {
      border-radius: ${token.borderRadius}px;
      outline: 2px solid ${token.colorPrimary};
    }
  `,
  promptTag: css`
    cursor: default;
    user-select: none;
    display: inline-flex;

    &.selected {
      border-radius: ${token.borderRadius}px;
      outline: 2px solid ${token.colorSuccess};
    }
  `,
}));

export const actionTagTheme = {
  actionTag: 'editor-action-tag',
};
