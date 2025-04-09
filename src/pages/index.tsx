import { useState, useEffect } from "react";
import { News } from "@/interfaces/news";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const data = await response.json();
        setNews(data);
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
        <title>cbrazil.com - IA para Todos</title>
        <meta name="description" content="Blog sobre Inteligência Artificial, Processamento de Linguagem Natural e Machine Learning para todos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="py-8 border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image 
                  src="/images/cbrazil_v6.png" 
                  alt="cbrazil.com Logo" 
                  width={220} 
                  height={60} 
                  className="mr-2"
                />
              </div>
              <nav className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Início
                </Link>
                <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
                  Categorias
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
          <div className="relative h-screen">
            <Image
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
              alt="IA para Todos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70">
              <div className="h-full flex flex-col justify-center items-center text-center px-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                  IA para Todos: Aprenda, Explore e Transforme com a Inteligência Artificial
                </h2>
                <p className="text-xl text-white/90 max-w-2xl">
                  Descubra como a Inteligência Artificial está transformando o mundo e como você pode fazer parte dessa revolução
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Artigos em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 6).map((article) => (
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
                        <time dateTime={article.datetime}>{article.date}</time>
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
