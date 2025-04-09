import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Article, Author, Category } from "@prisma/client";

type ArticleWithRelations = Article & {
  author: Author;
  category: Category;
};

export default function IaParaIniciantes() {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/ai-articles/search?category=ia-para-iniciantes");
        if (!response.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const data = await response.json();
        setArticles(data.articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar artigos");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>IA para Iniciantes - cbrazil.com</title>
        <meta name="description" content="Artigos sobre Inteligência Artificial para quem está começando" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="py-8 border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/">
                  <Image 
                    src="/images/cbrazil_v6.png" 
                    alt="cbrazil.com Logo" 
                    width={220} 
                    height={60} 
                    className="mr-2"
                  />
                </Link>
              </div>
              <nav className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Início
                </Link>
                <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
                  Categorias
                </Link>
                <Link href="/ia-para-iniciantes" className="text-blue-600 font-medium">
                  IA para Iniciantes
                </Link>
                <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre
                </Link>
                <Link href="/contato" className="text-gray-600 hover:text-gray-900">
                  Contato
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="relative h-64 md:h-96">
            <Image
              src="https://source.unsplash.com/random/1600x900/?artificial-intelligence"
              alt="IA para Iniciantes"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70">
              <div className="h-full flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                  IA para Iniciantes
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Artigos sobre Inteligência Artificial para quem está começando
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
                {error}
              </div>
            ) : null}

            {articles.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhum artigo encontrado</h2>
                <p className="text-gray-600 mb-8">
                  Ainda não temos artigos sobre IA para iniciantes. Em breve, novos conteúdos estarão disponíveis.
                </p>
                <Link 
                  href="/api/ai-articles/populate" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Popular Artigos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/news/${article.id}`}>
                      <div className="relative h-48">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                          <span>{article.category.title}</span>
                          <span>•</span>
                          <time dateTime={article.date.toISOString()}>
                            {new Date(article.date).toLocaleDateString('pt-BR')}
                          </time>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-2 mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <img
                            src={article.author.imageUrl}
                            alt={article.author.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <span>{article.author.name}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-12 mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">cbrazil.com</h2>
                <p className="text-gray-600 mt-1">IA para Todos</p>
              </div>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Início
                </Link>
                <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
                  Categorias
                </Link>
                <Link href="/ia-para-iniciantes" className="text-blue-600 font-medium">
                  IA para Iniciantes
                </Link>
                <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre
                </Link>
                <Link href="/contato" className="text-gray-600 hover:text-gray-900">
                  Contato
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} cbrazil.com. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 