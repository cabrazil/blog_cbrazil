
import { NextPage } from 'next';
import Link from 'next/link';
import { mockArticles } from '../../lib/mock-articles';

// Vamos usar o primeiro artigo do nosso mock como exemplo
const article = mockArticles[0];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/[^\w\-]+/g, '') // Remove caracteres inválidos
    .replace(/\-\-+/g, '-') // Substitui múltiplos hífens por um único
    .replace(/^-+/, '') // Remove hífens do início
    .replace(/-+$/, ''); // Remove hífens do fim
};

const ArticleExamplePage: NextPage = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem' }}>{article.title}</h1>
      <p style={{ lineHeight: 1.6, fontSize: '1.1rem' }}>
        Este é o conteúdo do artigo. Aqui falariamos sobre como a IA pode revolucionar a produtividade no ambiente de trabalho, apresentando diversas ferramentas e dicas práticas para iniciantes...
      </p>
      
      <hr style={{ margin: '2rem 0' }} />

      <div className="tags-container">
        <h3 style={{ marginBottom: '0.5rem' }}>Tags do Artigo:</h3>
        {
          article.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tags/${slugify(tag)}`}
              style={{
                display: 'inline-block',
                marginRight: '0.5rem',
                marginBottom: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#e0e0e0',
                color: '#333',
                borderRadius: '15px',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              {tag}
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default ArticleExamplePage;
