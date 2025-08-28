import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Category, AiPrompt } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

import { Author } from '@prisma/client';

interface GeneratePageProps {
  categories: Category[];
  prompts: AiPrompt[];
  authors: Author[];
}

export default function GenerateArticle({ categories, authors }: GeneratePageProps) {
  const router = useRouter();
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/admin/prompts");
      if (!response.ok) {
        throw new Error("Erro ao carregar prompts");
      }
      const data = await response.json();
      setPrompts((data.prompts || []).filter((prompt: AiPrompt) => prompt.isActive));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prompts");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!selectedCategory) {
      setError("Por favor, selecione uma categoria");
      return false;
    }
    if (!selectedAuthor) {
      setError("Por favor, selecione um autor");
      return false;
    }
    if (!topic.trim()) {
      setError("Por favor, digite um tópico");
      return false;
    }
    if (topic.length < 3) {
      setError("O tópico deve ter pelo menos 3 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }
    
    setGenerating(true);

    try {
      const response = await fetch("/api/ai-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: selectedPrompt ? parseInt(selectedPrompt) : null,
          categoryId: parseInt(selectedCategory),
          authorId: parseInt(selectedAuthor),
          topic,
          count: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao gerar artigo");
      }

      setSuccess("Artigo gerado com sucesso!");
      
      // Redirecionar para o artigo após 2 segundos
      setTimeout(() => {
        router.push(`/news/${data.articles[0].slug}`);
      }, 2000);
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(err instanceof Error ? err.message : "Erro ao gerar artigo");
    } finally {
      setGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    const { name, value } = e.target;
    
    switch (name) {
      case 'prompt':
        setSelectedPrompt(value);
        break;
      case 'category':
        setSelectedCategory(value);
        break;
      case 'topic':
        setTopic(value);
        break;
      case 'author':
        setSelectedAuthor(value);
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Gerar Artigo - Painel de Administração</title>
        <meta name="description" content="Gerar um novo artigo usando IA" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Gerar Artigo</h1>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                Voltar para o painel
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria do Artigo
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selectedCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Escolha a categoria em que o artigo será publicado.
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Autor do Artigo
                  </label>
                  <select
                    id="author"
                    name="author"
                    value={selectedAuthor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione um autor</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Selecione o autor que assinará o artigo.
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt de IA (opcional)
                  </label>
                  <select
                    id="prompt"
                    name="prompt"
                    value={selectedPrompt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um prompt</option>
                    {prompts.map((prompt) => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Se nenhum prompt for selecionado, será usado o prompt padrão.
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Tópico do Artigo
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={topic}
                    onChange={handleInputChange}
                    placeholder="Ex: Introdução à Inteligência Artificial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={3}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Descreva o tópico sobre o qual você deseja gerar um artigo.
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                    {success}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Link
                    href="/admin"
                    className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={generating || loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {generating ? "Gerando..." : "Gerar Artigo"}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();

  try {
    const blogId = Number(process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1);
    
    const categories = await prisma.category.findMany({
      where: { blogId: blogId }, // Adicionado para multi-tenant
      orderBy: { title: 'asc' },
    });

    // Usando uma abordagem alternativa para acessar o modelo aiPrompt
    const prompts = await (prisma as any).aiPrompt.findMany({
      where: { blogId: blogId }, // Adicionado para multi-tenant
      orderBy: { name: 'asc' },
    });

    const authors = await prisma.author.findMany({
      where: { blogId: blogId }, // Adicionado para multi-tenant
      orderBy: { name: 'asc' },
    });

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
        prompts: JSON.parse(JSON.stringify(prompts)),
        authors: JSON.parse(JSON.stringify(authors)),
      },
    };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return {
      props: {
        categories: [],
        prompts: [],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}; 