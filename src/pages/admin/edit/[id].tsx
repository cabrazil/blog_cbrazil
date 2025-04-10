import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import { Article, Category } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';

interface EditArticlePageProps {
  article: Article & {
    author: {
      id: number;
      name: string;
      role: string;
      imageUrl: string;
    };
    category: {
      id: number;
      title: string;
    };
  };
  categories: Category[];
}

export default function EditArticle({ article, categories }: EditArticlePageProps) {
  const router = useRouter();
  const { id } = router.query;
  
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content || '');
  
  // Log para verificar o conteúdo
  useEffect(() => {
    console.log('Conteúdo carregado:', article.content);
  }, [article.content]);
  
  const [description, setDescription] = useState(article.description);
  const [imageUrl, setImageUrl] = useState(article.imageUrl);
  const [categoryId, setCategoryId] = useState(article.categoryId);
  const [published, setPublished] = useState(article.published);
  const [uploading, setUploading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }
      
      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Log para verificar o conteúdo antes de enviar
      console.log('Conteúdo a ser enviado:', content);
      
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          description,
          imageUrl,
          categoryId,
          published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar artigo');
      }

      setSuccess('Artigo atualizado com sucesso!');
      
      // Redirecionar para o artigo após 2 segundos
      setTimeout(() => {
        router.push(`/news/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar artigo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Editar Artigo - Painel de Administração</title>
        <meta name="description" content="Editar um artigo existente" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Editar Artigo</h1>
              <Link href={`/news/${id}`} className="text-blue-600 hover:text-blue-800">
                Ver artigo
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Conteúdo
                    </label>
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Imagem
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                      <label
                        htmlFor="image"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {uploading ? "Fazendo upload..." : "Escolher imagem"}
                      </label>
                      {imageUrl && (
                        <div className="relative h-20 w-20">
                          <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Ou cole a URL da imagem aqui"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Publicado
                    </label>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                    {success}
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Link
                    href={`/news/${id}`}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const prisma = new PrismaClient();
  const id = params?.id;

  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: true,
        category: true,
      },
    });

    if (!article) {
      return {
        notFound: true,
      };
    }

    const categories = await prisma.category.findMany({
      orderBy: { title: 'asc' },
    });

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
        categories: JSON.parse(JSON.stringify(categories)),
      },
    };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }
}; 