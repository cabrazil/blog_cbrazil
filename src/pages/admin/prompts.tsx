import { useState } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { AiPrompt } from '@prisma/client';

interface PromptsPageProps {
  prompts: AiPrompt[];
  totalPages: number;
  currentPage: number;
}

export default function PromptsPage({ prompts, totalPages, currentPage }: PromptsPageProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrompt),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar prompt');
      }

      setSuccess('Prompt criado com sucesso!');
      setNewPrompt({ name: '', content: '' });
      router.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar prompt');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) {
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir prompt');
      }

      setSuccess('Prompt excluído com sucesso!');
      router.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir prompt');
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/admin/prompts?page=${page}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompts de IA</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Novo Prompt
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Prompt</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="Use {topic} para referenciar o tópico do artigo"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Criar
              </button>
            </div>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
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
                </div>
                <button
                  onClick={() => handleDelete(prompt.id)}
                  className="ml-4 text-red-600 hover:text-red-900 focus:outline-none"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >Anterior</button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >Próxima</button>
          </div>
        )}
      </div>
    </div>
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
        where: { ativo: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.aiPrompt.count({ where: { ativo: true } })
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