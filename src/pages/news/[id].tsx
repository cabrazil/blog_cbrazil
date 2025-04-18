import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { News } from "@/interfaces/news";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Article, Category } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  // Função para processar o conteúdo HTML
  const processContent = (content: string) => {
    // Se o conteúdo estiver vazio, retorna uma string vazia
    if (!content) return '';
    
    // Verifica se o conteúdo já é HTML
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Se não for HTML, converte para HTML
    // Substitui quebras de linha por <br>
    return content.replace(/\n/g, '<br>');
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

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
    return <div className="container mx-auto px-4 py-8">Carregando...</div>;
  }

  if (error || !article) {
    return <div className="container mx-auto px-4 py-8">Erro: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>{article.title} | AI Blog</title>
        <meta name="description" content={article.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
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
              />
            </div>
          )}
          <div className="prose prose-lg max-w-none article-content">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </article>
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
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enviar
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
            <Link 
              href={`/admin/edit/${id}`} 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Editar Artigo
            </Link>
            <button className="text-sm text-gray-500 hover:text-gray-900">
              Compartilhar
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
