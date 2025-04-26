import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/artigos/${article.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <time dateTime={article.createdAt}>
              {format(new Date(article.createdAt), "d 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{article.category}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-gray-600 line-clamp-3">{article.description}</p>
        </div>
      </Link>
    </article>
  );
} 