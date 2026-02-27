import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useController, useFormContext } from 'react-hook-form';
import * as S from './RichTextEditor.styles';

interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const RichTextEditor = ({ name, label, placeholder, required }: RichTextEditorProps) => {
  const { control, formState } = useFormContext();
  const { field } = useController({ control, name, defaultValue: '' });
  const fieldError = formState.errors[name] as { message?: string } | undefined;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder || '' }),
    ],
    content: field.value || '',
    onUpdate: ({ editor }) => {
      field.onChange(editor.isEmpty ? '' : editor.getHTML());
    },
    onBlur: () => field.onBlur(),
  });

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
          <S.ToolbarButton
            type="button"
            isActive={editor?.isActive('bold')}
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().toggleBold().run();
            }}
            title="Bold"
          >
            B
          </S.ToolbarButton>
          <S.ToolbarButton
            type="button"
            isActive={editor?.isActive('italic')}
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().toggleItalic().run();
            }}
            title="Italic"
            style={{ fontStyle: 'italic' }}
          >
            I
          </S.ToolbarButton>
          <S.ToolbarButton
            type="button"
            isActive={editor?.isActive('underline')}
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().toggleUnderline().run();
            }}
            title="Underline"
            style={{ textDecoration: 'underline' }}
          >
            U
          </S.ToolbarButton>
          <S.Divider />
          <S.ToolbarButton
            type="button"
            isActive={editor?.isActive('bulletList')}
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().toggleBulletList().run();
            }}
            title="Bullet List"
          >
            ≡
          </S.ToolbarButton>
          <S.ToolbarButton
            type="button"
            isActive={editor?.isActive('orderedList')}
            onMouseDown={(e) => {
              e.preventDefault();
              editor?.chain().focus().toggleOrderedList().run();
            }}
            title="Ordered List"
          >
            №
          </S.ToolbarButton>
        </S.Toolbar>
        <EditorContent editor={editor} />
      </S.EditorWrapper>
      {fieldError && <S.ErrorWrapper>{fieldError.message}</S.ErrorWrapper>}
    </S.StyledFormControl>
  );
};
