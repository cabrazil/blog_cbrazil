import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

interface Article {
  id: number
  title: string
  description: string
  imageUrl: string
  published: boolean
  createdAt: string
}

interface Prompt {
  id: number
  name: string
  content: string
  isActive: boolean
  createdAt: string
}

interface AdminPageProps {
  articles: Article[]
  prompts: Prompt[]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export default function AdminPage({ articles: initialArticles, prompts: initialPrompts }: AdminPageProps) {
  const router = useRouter()
  const [articles] = useState(initialArticles)
  const [prompts] = useState(initialPrompts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir artigo')
      }

      router.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir artigo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePrompt = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir prompt')
      }

      router.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir prompt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Painel de Administração</title>
        <meta name="description" content="Painel de administração do blog" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
              <div className="flex space-x-4">
                <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver Blog
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="text-red-600 hover:text-red-800"
                >
                  Sair
                </Link>
              </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Seção de Artigos */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Artigos</h2>
                  <Link
                    href="/admin/generate"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Gerar Novo
                  </Link>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {articles?.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {article.imageUrl && (
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {article.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          Criado em: {formatDate(article.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/edit/${article.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção de Prompts */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Prompts</h2>
                  <Link
                    href="/admin/prompts/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Novo Prompt
                  </Link>
                </div>

                <div className="space-y-4">
                  {prompts?.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {prompt.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {prompt.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          Criado em: {formatDate(prompt.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/prompts/${prompt.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeletePrompt(prompt.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient()

  try {
    const [articles, prompts] = await Promise.all([
      prisma.article.findMany({
        where: { blogId: 1 }, // Adicionado para multi-tenant
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          published: true,
          createdAt: true,
        },
      }),
      prisma.aiPrompt.findMany({
        where: { blogId: 1 }, // Adicionado para multi-tenant
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          content: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ])

    return {
      props: {
        articles: JSON.parse(JSON.stringify(articles)),
        prompts: JSON.parse(JSON.stringify(prompts)),
      },
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return {
      props: {
        articles: [],
        prompts: [],
      },
    }
  } finally {
    await prisma.$disconnect()
  }
} 