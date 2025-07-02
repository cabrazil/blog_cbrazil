// src/components/HtmlEditor.tsx
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface HtmlEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
                 'bold italic backcolor | alignleft aligncenter ' +
                 'alignright alignjustify | bullist numlist outdent indent | ' +
                 'removeformat | help | code',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={onChange}
    />
  );
}