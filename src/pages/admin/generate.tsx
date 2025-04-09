import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Category } from '@prisma/client';

interface GeneratePageProps {
  categories: Category[];
  prompts: any[]; // Temporariamente usando any para o modelo AiPrompt
}

export default function GeneratePage({ categories, prompts }: GeneratePageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: parseInt(selectedCategory),
          promptId: selectedPrompt ? parseInt(selectedPrompt) : null,
          customPrompt: customPrompt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar artigo');
      }

      setSuccess('Artigo gerado com sucesso!');
      router.push(`/admin/articles/${data.article.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar artigo');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerar Artigo com IA</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt (opcional)
          </label>
          <select
            id="prompt"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Use o prompt da categoria</option>
            {prompts.map((prompt) => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Personalizado (opcional)
          </label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Digite seu prompt personalizado aqui. Use {topic} para referenciar o tópico da categoria."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating || !selectedCategory}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isGenerating || !selectedCategory
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isGenerating ? 'Gerando...' : 'Gerar Artigo'}
        </button>
      </form>
    </div>
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