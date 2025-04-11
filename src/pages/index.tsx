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
    const checkApi = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const data = await response.json();
        console.log("Dados recebidos:", data);
        setNews(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar artigos");
        setLoading(false);
      }
    };

    checkApi();
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

  // Função para obter uma URL de avatar padrão
  const getDefaultAvatarUrl = (name: string): string => {
    return "/images/default-avatar.svg";
  };

  // Componente de imagem com fallback
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
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => {
            console.log('Imagem carregada:', imgSrc);
            setIsLoading(false);
          }}
          onError={() => {
            console.error('Erro ao carregar imagem:', imgSrc);
            setImgSrc(getDefaultImageUrl(alt));
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  };

  // Componente de avatar com fallback
  const AuthorAvatar = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      setImgSrc(src);
      setIsLoading(true);
    }, [src]);

    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`rounded-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => {
            console.log('Avatar carregado:', imgSrc);
            setIsLoading(false);
          }}
          onError={() => {
            console.error('Erro ao carregar avatar:', imgSrc);
            setImgSrc(getDefaultAvatarUrl(alt));
            setIsLoading(false);
          }}
          sizes="24px"
        />
      </div>
    );
  };

  // Componente de imagem principal com fallback
  const HeroImage = () => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Placeholder durante o carregamento */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        
        {/* Imagem principal */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
            alt="IA para Todos"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onLoad={() => {
              console.log('Imagem principal carregada');
              setImageLoaded(true);
            }}
          />
        </div>
        
        {/* Gradiente e conteúdo */}
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
    );
  };

  if (loading) {
    return (
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
                  priority
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
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

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
                  priority
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
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <HeroImage />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Artigos em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.slice(0, 6).map((article) => {
                // Verificar se a URL da imagem é válida
                const imageUrl = isValidImageUrl(article.imageUrl) 
                  ? article.imageUrl 
                  : getDefaultImageUrl(article.title);
                
                // Verificar se a URL da imagem do autor é válida
                const authorImageUrl = isValidImageUrl(article.author?.imageUrl)
                  ? article.author.imageUrl
                  : getDefaultAvatarUrl(article.author?.name || 'Author');
                
                return (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/news/${article.id}`}>
                      <div className="relative h-48 w-full">
                        <ArticleImage
                          src={imageUrl}
                          alt={article.title}
                          className="h-48 w-full"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                          <span>{article.category?.title || 'Sem categoria'}</span>
                          <span>•</span>
                          <time dateTime={article.datetime}>{article.date}</time>
                        </div>
                        <h2 className="home-article-title">
                          {article.title}
                        </h2>
                        <p className="home-article-description line-clamp-2 mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <AuthorAvatar
                            src={authorImageUrl}
                            alt={article.author?.name || 'Autor'}
                            className="h-6 w-6"
                          />
                          <span>{article.author?.name || 'Autor'}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
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
