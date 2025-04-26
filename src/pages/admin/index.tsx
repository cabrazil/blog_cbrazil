import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { AiPrompt, Article } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Article as ArticleType } from "@/types/article";

export default function AdminDashboard() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar prompts
        const promptsResponse = await fetch("/api/admin/prompts");
        if (!promptsResponse.ok) {
          throw new Error("Erro ao carregar prompts");
        }
        const promptsData = await promptsResponse.json();
        setPrompts(promptsData);
        
        // Carregar artigos
        const articlesResponse = await fetch("/api/news", {
          headers: {
            "x-admin-request": "true"
          }
        });
        if (!articlesResponse.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const articlesData = await articlesResponse.json();
        
        // Garantir que articles seja sempre um array
        const validArticles = Array.isArray(articlesData.articles) 
          ? articlesData.articles.map((article: any) => ({
              id: article.id || '',
              title: article.title || '',
              slug: article.slug || '',
              createdAt: article.createdAt || new Date().toISOString(),
              updatedAt: article.updatedAt || new Date().toISOString(),
              description: article.description || '',
              imageUrl: article.imageUrl || '',
              parentId: article.parentId || null,
              aiKeywords: article.aiKeywords || [],
              aiPrompt: article.aiPrompt || '',
              published: article.published || false
            }))
          : [];

        setArticles(validArticles);
      } catch (err) {
        console.error("Erro ao carregar artigos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: "DELETE",
          headers: {
            "x-admin-request": "true",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir artigo");
        }

        // Atualizar a lista de artigos após a exclusão
        setArticles(articles.filter((article) => article.id !== id));
      } catch (err) {
        console.error("Erro ao excluir artigo:", err);
        alert("Erro ao excluir artigo. Por favor, tente novamente.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Painel de Administração - cbrazil.com</title>
        <meta name="description" content="Painel de administração do blog sobre IA" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Voltar para o site
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Gerenciamento de Artigos sobre IA</h2>
              
              <div className="mb-6">
                <Link 
                  href="/admin/generate" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gerar Novo Artigo
                </Link>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Artigos Recentes</h3>
                {articles.length === 0 ? (
                  <p>Nenhum artigo encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Título
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {articles.map((article) => (
                          <tr key={article.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {article.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {article.published ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Publicado
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Rascunho
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => router.push(`/news/${article.id}`)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Ver
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleEdit(article.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleDelete(article.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Excluir
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gerenciamento de Prompts</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Prompts de IA Disponíveis</h3>
                {prompts.length === 0 ? (
                  <p>Nenhum prompt encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conteúdo
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {prompts.map((prompt) => (
                          <tr key={prompt.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {prompt.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {prompt.content.length > 100 
                                ? `${prompt.content.substring(0, 100)}...` 
                                : prompt.content}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {prompt.isActive ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Ativo
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Inativo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link 
                                href={`/admin/prompts/${prompt.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Editar
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link 
                  href="/admin/prompts/new" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Criar Novo Prompt
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 