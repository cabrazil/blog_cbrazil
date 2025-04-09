import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Category, AiPrompt } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

interface GeneratePageProps {
  categories: Category[];
  prompts: AiPrompt[];
}

export default function GenerateArticle() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
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
      setPrompts(data.filter((prompt: AiPrompt) => prompt.isActive));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/ai-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: selectedPrompt ? parseInt(selectedPrompt) : null,
          topic,
          count: 1,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao gerar artigo");
      }

      const data = await response.json();
      setSuccess("Artigo gerado com sucesso!");
      setGenerating(false);
      
      // Redirecionar para o artigo após 2 segundos
      setTimeout(() => {
        router.push(`/news/${data.articles[0].id}`);
      }, 2000);
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(err instanceof Error ? err.message : "Erro ao gerar artigo");
      setGenerating(false);
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
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt de IA (opcional)
                  </label>
                  <select
                    id="prompt"
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
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
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Introdução à Inteligência Artificial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
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
    const categories = await prisma.category.findMany({
      orderBy: { title: 'asc' },
    });

    // Usando uma abordagem alternativa para acessar o modelo aiPrompt
    const prompts = await (prisma as any).aiPrompt.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)),
        prompts: JSON.parse(JSON.stringify(prompts)),
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