import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Article, Category, Author } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import prisma from "@/lib/prisma";

type ArticleWithCategory = Article & {
  category: Category;
  author: Author;
};

interface NewsDetailProps {
  article: ArticleWithCategory;
}

export default function NewsDetail({ article }: NewsDetailProps) {
  if (!article) {
    return <div>Artigo não encontrado</div>;
  }

  return (
    <>
      <Head>
        <title>{article.title} | CBrazil Blog</title>
        <meta name="description" content={article.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 bg-transparent">{article.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
              <span>{article.category.title}</span>
              <span className="mx-2">•</span>
              <span>
                {format(new Date(article.createdAt), "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
            {article.imageUrl && (
              <div className="relative w-full h-96 mb-8">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none article-content">
              <div className="article-content-body" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {article.author && (
              <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-end space-x-4">
                {article.author.id === 1 ? (
                  <>
                    {article.author.imageUrl && (
                      <Image
                        src={article.author.imageUrl}
                        alt={article.author.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{article.author.name}</p>
                      {article.author.bio && (
                        <p className="text-sm text-gray-600 italic">{article.author.bio}</p>
                      )}
                    </div>
                  </>
                ) : (
                  article.author.signature && (
                    <div className="text-right text-gray-600 italic">
                      <p>{article.author.signature}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    const article = await prisma.article.findUnique({
      where: { slug: slug as string },
      include: { category: true, author: true },
    });

    if (!article) {
      return { notFound: true };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
    };
  } catch (error) {
    console.error("Erro ao buscar artigo:", error);
    return { notFound: true };
  }
};
