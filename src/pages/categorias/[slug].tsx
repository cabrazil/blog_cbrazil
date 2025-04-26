import { GetServerSideProps } from 'next';
import { PrismaClient, Category, Article } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface CategoryWithArticles extends Category {
  articles: (Article & {
    author: {
      name: string;
      imageUrl: string;
    };
  })[];
}

interface CategoryPageProps {
  category: CategoryWithArticles | null;
  totalPages: number;
}

export default function CategoryPage({ category, totalPages: initialTotalPages }: CategoryPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState(category?.articles || []);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Categoria não encontrada</h1>
            <Link href="/categorias" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              Voltar para categorias
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      try {
        const response = await fetch(`/api/categories/${category.slug}?page=${newPage}&limit=6`);
        if (!response.ok) {
          throw new Error('Erro ao carregar artigos');
        }
        const data = await response.json();
        setArticles(data.articles);
        setCurrentPage(newPage);
      } catch (error) {
        console.error('Erro ao carregar artigos:', error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{category.title} - cbrazil.com</title>
        <meta name="description" content={category.description || `Artigos sobre ${category.title}`} />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-gray-100">
          <Header />
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{category.title}</h1>
            {category.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum artigo encontrado nesta categoria.</p>
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
                          <time dateTime={new Date(article.createdAt).toISOString()}>
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

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const prisma = new PrismaClient();
  const slug = params?.slug as string;
  const page = parseInt(query.page as string) || 1;
  const limit = 6;

  try {
    const category = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (!category) {
      return {
        props: {
          category: null,
          totalPages: 0,
        },
      };
    }

    const totalArticles = await prisma.article.count({
      where: {
        categoryId: category.id,
        published: true,
      },
    });

    const totalPages = Math.ceil(totalArticles / limit);

    const articles = await prisma.article.findMany({
      where: {
        categoryId: category.id,
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Convertendo as datas para strings ISO
    const serializedArticles = articles.map(article => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      date: article.date?.toISOString() || null,
    }));

    return {
      props: {
        category: {
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
          articles: serializedArticles,
        },
        totalPages,
      },
    };
  } catch (error) {
    console.error('Erro ao carregar categoria:', error);
    return {
      props: {
        category: null,
        totalPages: 0,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}; 