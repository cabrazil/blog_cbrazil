import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

interface Prompt {
  id: number
  name: string
  content: string
  isActive: boolean
  createdAt: string
}

interface EditPromptPageProps {
  prompt: Prompt
}

export default function EditPromptPage({ prompt: initialPrompt }: EditPromptPageProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao atualizar prompt')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar prompt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Editar Prompt - Painel de Administração</title>
        <meta name="description" content="Editar prompt de IA" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Editar Prompt</h1>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                Voltar para o painel
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  Prompt atualizado com sucesso! Redirecionando...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={prompt.name}
                    onChange={(e) => {
                      setPrompt({ ...prompt, name: e.target.value })
                      setError(null)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Digite um nome para o prompt"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo
                  </label>
                  <textarea
                    id="content"
                    value={prompt.content}
                    onChange={(e) => {
                      setPrompt({ ...prompt, content: e.target.value })
                      setError(null)
                    }}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Use {topic} para referenciar o tópico do artigo. Exemplo: 'Escreva um artigo sobre {topic}'"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Use {'{topic}'} para referenciar o tópico do artigo. O texto será substituído automaticamente.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={prompt.isActive}
                    onChange={(e) => setPrompt({ ...prompt, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Ativo
                  </label>
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
                    disabled={isLoading || success}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : success ? 'Salvo!' : 'Salvar'}
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
  const prisma = new PrismaClient()
  const id = parseInt(context.params?.id as string)

  if (isNaN(id)) {
    return {
      notFound: true,
    }
  }

  try {
    const prompt = await prisma.aiPrompt.findFirst({
      where: { 
        id,
        blogId: 1, // Adicionado para multi-tenant
      },
    })

    if (!prompt) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        prompt: JSON.parse(JSON.stringify(prompt)),
      },
    }
  } catch (error) {
    console.error('Erro ao carregar prompt:', error)
    return {
      notFound: true,
    }
  } finally {
    await prisma.$disconnect()
  }
} 