import { useState } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { AiPrompt } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

interface Prompt {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

interface PromptsPageProps {
  prompts: Prompt[];
  totalPages: number;
  currentPage: number;
}

export default function PromptsPage({ prompts: initialPrompts, totalPages, currentPage }: PromptsPageProps) {
  const router = useRouter();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    content: '',
    isActive: true
  });
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar prompt');
      }

      const data = await response.json();
      setPrompts([...prompts, data]);
      setIsCreating(false);
      setNewPrompt({ name: '', content: '', isActive: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar prompt');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir prompt');
      }

      setPrompts(prompts.filter(prompt => prompt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir prompt');
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/prompts?page=${page}`);
  };

  return (
    <>
      <Head>
        <title>Prompts de IA - Painel de Administração</title>
        <meta name="description" content="Gerenciar prompts de IA" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Prompts de IA</h1>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                Voltar para o painel
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Lista de Prompts</h2>
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Novo Prompt
                </button>
              </div>

              {isCreating && (
                <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Criar Novo Prompt</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newPrompt.name}
                        onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Conteúdo
                      </label>
                      <textarea
                        id="content"
                        value={newPrompt.content}
                        onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Use {topic} para referenciar o tópico do artigo"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={newPrompt.isActive}
                        onChange={(e) => setNewPrompt({ ...newPrompt, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Ativo
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Criar Prompt
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {prompts.map((prompt) => (
                    <li key={prompt.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{prompt.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{prompt.content}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Criado em: {new Date(prompt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                          <Link
                            href={`/admin/prompts/${prompt.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(prompt.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 p-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-sm">Página {currentPage} de {totalPages}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const prisma = new PrismaClient();
  const page = parseInt((ctx.query.page as string) || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const [prompts, total] = await Promise.all([
      prisma.aiPrompt.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aiPrompt.count({ where: { isActive: true } })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      props: {
        prompts: JSON.parse(JSON.stringify(prompts)),
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar prompts:', error);
    return {
      props: {
        prompts: [],
        totalPages: 1,
        currentPage: 1,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}; 