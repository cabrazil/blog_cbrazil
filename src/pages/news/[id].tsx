import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { News } from "@/interfaces/news";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Article, Category } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-quill/dist/quill.snow.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type ArticleWithCategory = Article & {
  category: Category;
};

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<ArticleWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
      checkAdminStatus();
    }
  }, [id]);

  const checkAdminStatus = async () => {
    try {
      console.log('Verificando status de admin...');
      const response = await fetch('/api/admin/check', {
        headers: {
          'x-admin-request': 'true'
        }
      });
      console.log('Resposta do check admin:', response.status);
      setIsAdmin(response.ok);
    } catch (err) {
      console.error('Erro ao verificar admin:', err);
      setIsAdmin(false);
    }
  };

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${id}`);
      if (!response.ok) {
        throw new Error('Artigo não encontrado');
      }
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?articleId=${id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar comentários");
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      }
    };

    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          articleId: id,
          authorId: 1, // Temporariamente usando um ID fixo para testes
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar comentário");
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
      setShowCommentForm(false);
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-96 bg-gray-200 rounded-lg w-full"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Erro: {error}
          </div>
        </div>
        <Footer />
      </div>
    );
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
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
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
              <h2 className="text-xl text-gray-700 mb-8">{article.description}</h2>
              <div 
                className="ql-editor"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '<br>') 
                }}
              />
              {isAdmin && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <Link 
                    href={`/admin/edit/${article.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar Artigo
                  </Link>
                </div>
              )}
            </div>
          </article>

          <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">Comentários</h2>
            
            {showCommentForm ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCommentForm(true)}
                className="mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar Comentário
              </button>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={comment.author.imageUrl}
                      alt={comment.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{comment.author.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                ← Voltar para Home
              </Link>
              {/* <div className="flex items-center space-x-4">
                <button className="text-sm text-gray-500 hover:text-gray-900">
                  .
                </button>
              </div> */}
            </div>
          </footer>
        </main>

        <Footer />
      </div>
    </>
  );
}
