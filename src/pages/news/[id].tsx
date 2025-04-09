import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { News } from "@/interfaces/news";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${id}`);
        
        if (!response.ok) {
          throw new Error("Erro ao carregar o artigo");
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar o artigo");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{article.title} | AI Blog</title>
        <meta name="description" content={article.description} />
      </Head>

      <article className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span>•</span>
              <span>{article.category.title}</span>
              <span>•</span>
              <time dateTime={article.datetime}>{article.date}</time>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
            <div className="flex items-center space-x-4">
              <img
                src={article.author.imageUrl}
                alt={article.author.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.role}</p>
              </div>
            </div>
          </header>

          {article.imageUrl && (
            <div className="relative w-full h-[400px] mb-8">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comentários</h2>
            
            {!showCommentForm ? (
              <button
                onClick={() => setShowCommentForm(true)}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Adicionar Comentário
              </button>
            ) : (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Digite seu comentário..."
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <div className="mt-4 flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enviar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
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

          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                ← Voltar para Home
              </Link>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-gray-500 hover:text-gray-900">
                  Compartilhar
                </button>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
