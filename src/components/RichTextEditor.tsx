import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  // Função para processar o conteúdo HTML
  const processContent = (content: string | null): string => {
    if (!content) return '';
    
    // Se o conteúdo já for HTML, retorna como está
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Converte quebras de linha em <br>
    return content.replace(/\n/g, '<br>');
  };

  // Atualiza o conteúdo do editor quando o valor muda
  useEffect(() => {
    if (editorRef.current && editorRef.current.editor) {
      const processedContent = processContent(value);
      editorRef.current.editor.setContent(processedContent);
    }
  }, [value]);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      value={processContent(value)}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
        images_upload_url: '/api/upload',
        images_upload_handler: async (blobInfo, progress) => {
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
              headers: {
                'x-tinymce-upload': 'true'
              }
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const data = await response.json();
            return data.location;
          } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Upload failed');
          }
        },
        setup: (editor) => {
          editor.on('change', () => {
            const content = editor.getContent();
            onChange(content);
          });
        }
      }}
    />
  );
} 