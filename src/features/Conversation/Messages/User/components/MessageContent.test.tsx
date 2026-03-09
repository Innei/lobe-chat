import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MessageContent from './MessageContent';

vi.mock('@/features/Conversation/Markdown', () => ({
  default: ({ children }: any) => <div data-testid="markdown-message">{children}</div>,
}));

vi.mock('../useMarkdown', () => ({
  useMarkdown: () => ({}),
}));

vi.mock('./RichTextMessage', () => ({
  default: ({ editorState }: any) => (
    <div data-testid="rich-message">{JSON.stringify(editorState)}</div>
  ),
}));

vi.mock('./FileListViewer', () => ({
  default: () => null,
}));
vi.mock('./ImageFileListViewer', () => ({
  default: () => null,
}));
vi.mock('./PageSelections', () => ({
  default: () => null,
}));
vi.mock('./VideoFileListViewer', () => ({
  default: () => null,
}));

describe('User MessageContent', () => {
  it('should prefer rich text rendering when inputEditorState exists', () => {
    render(
      <MessageContent
        content={'markdown-content'}
        createdAt={Date.now()}
        id={'msg-1'}
        role={'user'}
        updatedAt={Date.now()}
        metadata={{
          inputEditorState: { root: { children: [], type: 'root', version: 1 } },
        }}
      />,
    );

    expect(screen.getByTestId('rich-message')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-message')).not.toBeInTheDocument();
  });

  it('should render markdown when inputEditorState is missing', () => {
    render(
      <MessageContent
        content={'markdown-content'}
        createdAt={Date.now()}
        id={'msg-2'}
        role={'user'}
        updatedAt={Date.now()}
      />,
    );

    expect(screen.getByTestId('markdown-message')).toBeInTheDocument();
    expect(screen.queryByTestId('rich-message')).not.toBeInTheDocument();
  });
});
