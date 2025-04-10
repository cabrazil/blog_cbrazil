import { Editor } from '@tinymce/tinymce-react';
import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  // Função para processar o conteúdo HTML
  const processContent = (content: string) => {
    // Se o conteúdo estiver vazio, retorna uma string vazia
    if (!content) return '';
    
    // Verifica se o conteúdo já é HTML
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Se não for HTML, converte para HTML
    // Substitui quebras de linha por <br>
    return content.replace(/\n/g, '<br>');
  };

  // Garantir que o conteúdo seja atualizado quando o valor mudar
  useEffect(() => {
    if (editorRef.current) {
      const processedContent = processContent(value);
      if (editorRef.current.getContent() !== processedContent) {
        editorRef.current.setContent(processedContent);
      }
    }
  }, [value]);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt: any, editor: any) => {
        editorRef.current = editor;
        // Inicializa o editor com o conteúdo processado
        const processedContent = processContent(value);
        editor.setContent(processedContent);
      }}
      value={processContent(value)}
      init={{
        height: 500,
        menubar: true,
        language: 'pt_BR',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.7;
            color: #333;
            max-width: 100%;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 700;
            line-height: 1.2;
          }
          h1 { font-size: 2em; }
          h2 { font-size: 1.75em; }
          h3 { font-size: 1.5em; }
          h4 { font-size: 1.25em; }
          p { margin-bottom: 1.5em; }
          a { color: #2563eb; text-decoration: underline; }
          ul, ol { margin-bottom: 1.5em; padding-left: 2em; }
          li { margin-bottom: 0.5em; }
          blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1em;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            color: #6b7280;
          }
          pre {
            background-color: #f3f4f6;
            padding: 1em;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin-bottom: 1.5em;
          }
          code {
            background-color: #f3f4f6;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 0.875em;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5em 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5em;
          }
          table th, table td {
            border: 1px solid #e5e7eb;
            padding: 0.75em;
            text-align: left;
          }
          table th {
            background-color: #f9fafb;
            font-weight: 600;
          }
          hr {
            border: 0;
            border-top: 1px solid #e5e7eb;
            margin: 2em 0;
          }
        `,
        images_upload_url: '/api/upload',
        images_upload_handler: async (blobInfo, progress) => {
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Upload failed');
            }

            const data = await response.json();
            return data.url;
          } catch (error) {
            console.error('Upload error:', error);
            throw error;
          }
        },
        automatic_uploads: true,
        file_picker_types: 'image',
        images_reuse_filename: true,
        images_upload_base_path: '/uploads',
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        formats: {
          p: { block: 'p', classes: 'mb-6' },
          h1: { block: 'h1', classes: 'text-3xl font-bold mb-4' },
          h2: { block: 'h2', classes: 'text-2xl font-bold mb-3' },
          h3: { block: 'h3', classes: 'text-xl font-bold mb-2' },
          h4: { block: 'h4', classes: 'text-lg font-bold mb-2' },
          blockquote: { block: 'blockquote', classes: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4' },
        },
        style_formats: [
          { title: 'Headings', items: [
            { title: 'Heading 1', format: 'h1' },
            { title: 'Heading 2', format: 'h2' },
            { title: 'Heading 3', format: 'h3' },
            { title: 'Heading 4', format: 'h4' }
          ]},
          { title: 'Inline', items: [
            { title: 'Bold', format: 'bold' },
            { title: 'Italic', format: 'italic' },
            { title: 'Underline', format: 'underline' },
            { title: 'Strikethrough', format: 'strikethrough' },
            { title: 'Code', format: 'code' }
          ]},
          { title: 'Blocks', items: [
            { title: 'Paragraph', format: 'p' },
            { title: 'Blockquote', format: 'blockquote' },
            { title: 'Div', format: 'div' }
          ]},
          { title: 'Alignment', items: [
            { title: 'Left', format: 'alignleft' },
            { title: 'Center', format: 'aligncenter' },
            { title: 'Right', format: 'alignright' },
            { title: 'Justify', format: 'alignjustify' }
          ]}
        ],
        entity_encoding: 'raw',
        encoding: 'html',
        decode_entities: false,
      }}
      onEditorChange={(newContent: string) => onChange(newContent)}
    />
  );
} 