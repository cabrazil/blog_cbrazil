import { useState, useEffect } from "react";
import { News } from "@/interfaces/news";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/news?page=1&limit=4", {
          headers: {
            'Cache-Control': 'public, max-age=60'
          }
        });
        if (!response.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const data = await response.json();
        setNews(data.articles);
        setTotalArticles(data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Função para verificar se uma URL é válida
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Função para obter uma URL de imagem padrão
  const getDefaultImageUrl = (title: string): string => {
    return "/images/default-article.svg";
  };

  // Componente de imagem com fallback e lazy loading
  const ArticleImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      setImgSrc(src);
      setIsLoading(true);
    }, [src]);

    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          loading="lazy"
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(getDefaultImageUrl(alt));
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  };

  // Componente de imagem principal com fundo integrado para evitar flash
  const HeroImage = () => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="relative h-[70vh] w-full overflow-hidden bg-gray-800">
        <div className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
            alt="IA para Todos"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70">
          <div className="h-full flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
              Inteligência Artificial na Prática: Da Curiosidade ao Resultado.
            </h2>
            <p className="text-xl text-white/90 max-w-3xl">
              Mais que um blog, um laboratório. Aprenda a criar prompts eficientes, escolher as ferramentas certas e aplicar a IA para resolver problemas reais e impulsionar sua carreira.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header blogId={1} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <Footer blogId={1} />
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
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header blogId={1} />

        <main className="flex-grow">
          <HeroImage />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Seção de Artigos em Destaque */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Artigos em Destaque</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/news/${article.slug}`}>
                      <div className="relative h-48 w-full">
                        <ArticleImage
                          src={isValidImageUrl(article.imageUrl) ? article.imageUrl! : getDefaultImageUrl(article.title)}
                          alt={article.title}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            IA para Iniciantes
                          </span>
                                                     <span className="ml-2">
                             {format(new Date(article.date), "d 'de' MMMM 'de' yyyy", {
                               locale: ptBR,
                             })}
                           </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
                            LEIA MAIS →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {totalArticles > 6 && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/artigos")}
                >
                  Ver Todos os Artigos
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer blogId={1} />
      </div>
    </>
  );
}
