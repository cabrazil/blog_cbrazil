import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { AiPrompt } from "@prisma/client";

export default function AdminDashboard() {
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch("/api/admin/prompts");
        if (!response.ok) {
          throw new Error("Erro ao carregar prompts");
        }
        const data = await response.json();
        setPrompts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

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
            <div className="bg-white shadow rounded-lg p-6">
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
                <h3 className="text-lg font-medium mb-2">Prompts de IA Disponíveis</h3>
                {loading ? (
                  <p>Carregando prompts...</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : prompts.length === 0 ? (
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
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Editar
                              </Link>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => {
                                  // Implementar exclusão
                                  console.log(`Excluir prompt ${prompt.id}`);
                                }}
                              >
                                Excluir
                              </button>
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