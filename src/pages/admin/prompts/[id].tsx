import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { AiPrompt } from "@prisma/client";

export default function EditPrompt() {
  const router = useRouter();
  const { id } = router.query;
  
  const [prompt, setPrompt] = useState<AiPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPrompt();
    }
  }, [id]);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/admin/prompts/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar prompt");
      }
      const data = await response.json();
      setPrompt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: prompt.name,
          content: prompt.content,
          isActive: prompt.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao atualizar prompt");
      }

      setSuccess("Prompt atualizado com sucesso!");
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este prompt?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir prompt");
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir prompt");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-4">Carregando...</div>;
  }

  if (!prompt) {
    return <div className="min-h-screen bg-gray-50 p-4">Prompt não encontrado</div>;
  }

  return (
    <>
      <Head>
        <title>Editar Prompt - Painel de Administração</title>
        <meta name="description" content="Editar prompt de IA" />
      </Head>

      <div className="min-h-screen bg-gray-50">
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Prompt
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={prompt.name}
                    onChange={(e) => setPrompt({ ...prompt, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo do Prompt
                  </label>
                  <textarea
                    id="content"
                    value={prompt.content}
                    onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Escreva o template do prompt que será usado para gerar artigos.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={prompt.isActive}
                      onChange={(e) => setPrompt({ ...prompt, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Prompt ativo</span>
                  </label>
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

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Excluir Prompt
                  </button>
                  
                  <div>
                    <Link
                      href="/admin"
                      className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 