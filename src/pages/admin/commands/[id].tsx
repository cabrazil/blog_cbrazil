import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Command {
  id: number
  name: string
  description: string
  content: string
  createdAt: string
}

interface EditCommandPageProps {
  command: Command
}

export default function EditCommandPage({ command: initialCommand }: EditCommandPageProps) {
  const router = useRouter()
  const [command, setCommand] = useState(initialCommand)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure command state is updated if initialCommand changes (e.g., during client-side navigation)
  useEffect(() => {
    setCommand(initialCommand);
  }, [initialCommand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/commands/${command.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar comando')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar comando')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle case where command might be undefined initially (e.g., notFound from getServerSideProps)
  if (!command) {
    return <div>Comando não encontrado.</div>;
  }

  return (
    <>
      <Head>
        <title>Editar Comando - Painel de Administração</title>
        <meta name="description" content="Editar comando" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Editar Comando</h1>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                Voltar para o painel
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={command.name}
                    onChange={(e) => setCommand({ ...command, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={command.description}
                    onChange={(e) => setCommand({ ...command, description: e.target.value })}
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
                    value={command.content}
                    onChange={(e) => setCommand({ ...command, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  if (!id || typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const command = await prisma.aiPrompt.findUnique({
      where: { id: parseInt(id as string) },
    });

    if (!command) {
      return { notFound: true };
    }

    return {
      props: {
        command: JSON.parse(JSON.stringify(command)),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar comando:', error);
    return { notFound: true };
  }
};