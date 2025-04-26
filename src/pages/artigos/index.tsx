import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Article } from "../../types/article";
import Header from "../../../app/components/Header";
import Footer from "../../../app/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news?page=${currentPage}&limit=6&excludeHome=true`);
        if (!response.ok) {
          throw new Error("Erro ao carregar artigos");
        }
        const data = await response.json();
        
        if (!Array.isArray(data.articles)) {
          throw new Error("Formato de dados inválido");
        }
        
        const validArticles = data.articles.map((article: any) => ({
          id: article.id || '',
          title: article.title || '',
          slug: article.slug || '',
          createdAt: article.createdAt || new Date().toISOString(),
          updatedAt: article.updatedAt || new Date().toISOString(),
          description: article.description || '',
          imageUrl: article.imageUrl || '',
          parentId: article.parentId || null,
          aiKeywords: article.aiKeywords || [],
          aiPrompt: article.aiPrompt || ''
        }));

        setArticles(validArticles);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        console.error("Erro ao carregar artigos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
        <title>Todos os Artigos | Blog</title>
        <meta name="description" content="Lista completa de artigos do blog" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-gray-100">
          <Header />
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Todos os Artigos</h1>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum artigo encontrado.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <article 
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link href={`/artigos/${article.slug}`}>
                    <div className="flex flex-col md:flex-row gap-4 p-4">
                      <div className="w-full md:w-1/4">
                        <div className="relative h-32 w-full">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-3/4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <time dateTime={article.createdAt}>
                            {format(new Date(article.createdAt), "d 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </time>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {article.description}
                        </p>
                        <div className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                          <span className="text-sm font-medium">Ler mais</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>

        <div className="bg-gray-100">
          <Footer />
        </div>
      </div>
    </>
  );
} 