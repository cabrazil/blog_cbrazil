import { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // Importação dinâmica do ReactQuill para evitar problemas de SSR
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { 
    ssr: false,
    loading: () => <p>Carregando editor...</p>
  }), []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  // Função para processar o conteúdo HTML
  const processContent = (content: string): string => {
    if (!content) return '';
    
    // Se o conteúdo já for HTML, retorna como está
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Converte quebras de linha em <br>
    return content.replace(/\n/g, '<br>');
  };

  return (
    <div className="h-[500px]">
      <ReactQuill
        theme="snow"
        value={processContent(value)}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-[450px]"
      />
    </div>
  );
} 