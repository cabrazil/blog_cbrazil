import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Article } from '@prisma/client';
import ArticleCard from '../components/ArticleCard';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      setLoading(true);
      fetch(`/api/ai-articles/search?q=${encodeURIComponent(q as string)}`)
        .then((res) => res.json())
        .then((data) => {
          setArticles(data.articles);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching search results:', err);
          setLoading(false);
        });
    }
  }, [q]);

  return (
    <>
      <Head>
        <title>{`Resultados da busca por "${q || ''}" - CBrazil Blog`}</title>
        <meta name="description" content={`Resultados da busca por "${q || ''}" no CBrazil Blog`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Resultados da busca por: <span className="text-blue-600">"{q}"</span>
          </h1>

          {loading ? (
            <p>Buscando...</p>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p>Nenhum artigo encontrado para a sua busca.</p>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
