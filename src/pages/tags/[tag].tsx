
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { mockArticles, MockArticle } from '../../lib/mock-articles';

interface TagPageProps {
  tag: string;
  articles: MockArticle[];
}

const TagPage: NextPage<TagPageProps> = ({ tag, articles }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Artigos com a tag: <span style={{ color: '#0070f3' }}>{tag}</span>
      </h1>
      <Link href="/" style={{ marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Voltar para a Home
      </Link>
      {articles.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {articles.map((article) => (
            <li key={article.id} style={{ marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
              <Link href={`/artigos/${article.slug}`} style={{ fontSize: '1.5rem', textDecoration: 'none', color: '#333' }}>
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum artigo encontrado com esta tag.</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tag } = context.params || {};
  const tagName = Array.isArray(tag) ? tag[0] : tag;

  if (!tagName) {
    return { notFound: true };
  }

  // Filtra os artigos que contêm a tag (case-insensitive)
  const filteredArticles = mockArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tagName.toLowerCase())
  );

  return {
    props: {
      tag: tagName,
      articles: filteredArticles,
    },
  };
};

export default TagPage;
