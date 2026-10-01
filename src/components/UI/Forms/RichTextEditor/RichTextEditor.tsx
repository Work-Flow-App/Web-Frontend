import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { useController, useFormContext } from 'react-hook-form';
import { createSvgIcon } from '@mui/material/utils';

import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatClearIcon from '@mui/icons-material/FormatClear';

import * as S from './RichTextEditor.styles';

// Clean SVG icons without the built-in bottom black bar
const CleanUnderlineIcon = createSvgIcon(
  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6z" />,
  'CleanUnderlineIcon'
);

const CleanTextColorIcon = createSvgIcon(
  <path d="M5.49 17h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5zm4.42-5.61 2.03-5.79h.12l2.03 5.79z" />,
  'CleanTextColorIcon'
);

const CleanPaintBucketIcon = createSvgIcon(
  <path d="M16.56 8.94 7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12M5.21 10 10 5.21 14.79 10zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5" />,
  'CleanPaintBucketIcon'
);

const CustomUnderline = Underline.extend({
  addAttributes() {
    return {
      color: {
        default: '#ffffff',
        parseHTML: (element) => element.style.textDecorationColor || null,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {
              style: 'text-decoration: underline;',
            };
          }
          return {
            style: `text-decoration: underline; text-decoration-color: ${attributes.color};`,
          };
        },
      },
    };
  },
});

interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  label,
  placeholder,
  required,
}) => {
  const { control, formState } = useFormContext();
  const { field } = useController({ control, name, defaultValue: '' });
  const fieldError = formState.errors[name] as { message?: string } | undefined;

  const [, forceUpdate] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomUnderline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || '' }),
    ],
    content: field.value || '',
    onSelectionUpdate: ({ editor: currentEditor }) => {
      // When text is deselected or cursor moves, clear cursor stored formatting so typing reverts to defaults!
      if (currentEditor.state.selection.empty) {
        currentEditor.commands.unsetMark('textStyle');
        currentEditor.commands.unsetMark('highlight');
        currentEditor.commands.unsetMark('underline');
        currentEditor.commands.unsetMark('bold');
        currentEditor.commands.unsetMark('italic');
      }
      forceUpdate({});
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      field.onChange(currentEditor.isEmpty ? '' : html);
    },
    onBlur: () => field.onBlur(),
  });

  if (!editor) return null;

  const isSelectionEmpty = editor.state.selection.empty;

  // STRICT RULE: When no text is selected, ALWAYS display default colors (#000000 for text, #ffffff for underline, #ffffff for bg)
  const activeTextColor = isSelectionEmpty
    ? '#000000'
    : editor.getAttributes('textStyle').color || '#000000';

  const activeUnderlineColor = isSelectionEmpty
    ? '#ffffff'
    : editor.getAttributes('underline').color || '#ffffff';

  const activeHighlightColor = isSelectionEmpty
    ? '#ffffff'
    : editor.getAttributes('highlight').color || '#ffffff';

  const isBoldActive = isSelectionEmpty ? false : editor.isActive('bold');
  const isItalicActive = isSelectionEmpty ? false : editor.isActive('italic');
  const isUnderlineActive = isSelectionEmpty ? false : editor.isActive('underline');
  const isTextColorActive = isSelectionEmpty ? false : Boolean(editor.getAttributes('textStyle').color);
  const isHighlightActive = isSelectionEmpty ? false : editor.isActive('highlight');

  const getHeadingValue = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'p';
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'p') {
      editor.chain().focus().setParagraph().run();
    } else if (val === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (val === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (val === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  return (
    <S.StyledFormControl fullWidth>
      {label && (
        <S.Label htmlFor={name}>
          {label}
          {required && <S.RequiredIndicator> *</S.RequiredIndicator>}
        </S.Label>
      )}
      <S.EditorWrapper>
        <S.Toolbar>
          <S.ToolbarGroup>
            <S.ToolbarButton
              type="button"
              disabled={!editor.can().undo()}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
              }}
              title="Undo"
            >
              <UndoIcon />
            </S.ToolbarButton>
            <S.ToolbarButton
              type="button"
              disabled={!editor.can().redo()}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
              }}
              title="Redo"
            >
              <RedoIcon />
            </S.ToolbarButton>
          </S.ToolbarGroup>

          <S.Divider />

          <S.ToolbarGroup>
            <S.HeadingSelect value={getHeadingValue()} onChange={handleHeadingChange} aria-label="Text style">
              <option value="p">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </S.HeadingSelect>
          </S.ToolbarGroup>

          <S.Divider />

          <S.ToolbarGroup>
            <S.ToolbarButton
              type="button"
              disabled={isSelectionEmpty}
              isActive={isBoldActive}
              onMouseDown={(e) => {
                e.preventDefault();
                if (isSelectionEmpty) return;
                editor.chain().focus().toggleBold().run();
              }}
              title={isSelectionEmpty ? 'Select text first to make Bold' : 'Bold'}
            >
              <FormatBoldIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              disabled={isSelectionEmpty}
              isActive={isItalicActive}
              onMouseDown={(e) => {
                e.preventDefault();
                if (isSelectionEmpty) return;
                editor.chain().focus().toggleItalic().run();
              }}
              title={isSelectionEmpty ? 'Select text first to make Italic' : 'Italic'}
            >
              <FormatItalicIcon />
            </S.ToolbarButton>

            <S.ColorControlWrapper
              $disabled={isSelectionEmpty}
              isActive={isUnderlineActive}
              title={
                isSelectionEmpty
                  ? 'Select text first to Underline'
                  : `Underline & Underline Color (${activeUnderlineColor})`
              }
            >
              <CleanUnderlineIcon />
              <S.ColorLine $color={activeUnderlineColor} />
              <input
                type="color"
                disabled={isSelectionEmpty}
                onChange={(e) => {
                  if (isSelectionEmpty) return;
                  const val = e.target.value;
                  editor.chain().focus().setMark('underline', { color: val }).run();
                }}
                value={activeUnderlineColor}
              />
            </S.ColorControlWrapper>

            <S.ColorControlWrapper
              $disabled={isSelectionEmpty}
              isActive={isTextColorActive}
              title={
                isSelectionEmpty
                  ? 'Select text first to change Text Color'
                  : `Text Color (${activeTextColor})`
              }
            >
              <CleanTextColorIcon />
              <S.ColorLine $color={activeTextColor} />
              <input
                type="color"
                disabled={isSelectionEmpty}
                onChange={(e) => {
                  if (isSelectionEmpty) return;
                  const val = e.target.value;
                  editor.chain().focus().setColor(val).run();
                }}
                value={activeTextColor}
              />
            </S.ColorControlWrapper>

            <S.ColorControlWrapper
              $disabled={isSelectionEmpty}
              isActive={isHighlightActive}
              title={
                isSelectionEmpty
                  ? 'Select text first to change Background Color'
                  : `Background Color (${activeHighlightColor})`
              }
            >
              <CleanPaintBucketIcon />
              <S.ColorLine $color={activeHighlightColor} />
              <input
                type="color"
                disabled={isSelectionEmpty}
                onChange={(e) => {
                  if (isSelectionEmpty) return;
                  const val = e.target.value;
                  editor.chain().focus().toggleHighlight({ color: val }).run();
                }}
                value={activeHighlightColor}
              />
            </S.ColorControlWrapper>
          </S.ToolbarGroup>

          <S.Divider />

          <S.ToolbarGroup>
            <S.ToolbarButton
              type="button"
              isActive={editor.isActive({ textAlign: 'left' })}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('left').run();
              }}
              title="Align Left"
            >
              <FormatAlignLeftIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              isActive={editor.isActive({ textAlign: 'center' })}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('center').run();
              }}
              title="Align Center"
            >
              <FormatAlignCenterIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              isActive={editor.isActive({ textAlign: 'right' })}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('right').run();
              }}
              title="Align Right"
            >
              <FormatAlignRightIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              isActive={editor.isActive({ textAlign: 'justify' })}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign('justify').run();
              }}
              title="Justify"
            >
              <FormatAlignJustifyIcon />
            </S.ToolbarButton>
          </S.ToolbarGroup>

          <S.Divider />

          <S.ToolbarGroup>
            <S.ToolbarButton
              type="button"
              isActive={editor.isActive('bulletList')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
              title="Bullet List"
            >
              <FormatListBulletedIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              isActive={editor.isActive('orderedList')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
              title="Ordered List"
            >
              <FormatListNumberedIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              isActive={editor.isActive('blockquote')}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBlockquote().run();
              }}
              title="Quote"
            >
              <FormatQuoteIcon />
            </S.ToolbarButton>

            <S.ToolbarButton
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().unsetAllMarks().clearNodes().run();
              }}
              title="Clear Formatting"
            >
              <FormatClearIcon />
            </S.ToolbarButton>
          </S.ToolbarGroup>
        </S.Toolbar>
        <EditorContent editor={editor} />
      </S.EditorWrapper>
      {fieldError && <S.ErrorWrapper>{fieldError.message}</S.ErrorWrapper>}
    </S.StyledFormControl>
  );
};
