
export interface MockArticle {
  id: number;
  title: string;
  slug: string;
  tags: string[];
}

export const mockArticles: MockArticle[] = [
  {
    id: 1,
    title: 'Guia Prático para Usar IA no Trabalho (Mesmo Sem Ser Expert)',
    slug: 'guia-pratico-ia-trabalho',
    tags: ['produtividade com IA', 'ferramentas de IA', 'iniciante'],
  },
  {
    id: 2,
    title: 'Engenharia de Prompt: 5 Dicas para Resultados Incríveis',
    slug: 'engenharia-de-prompt-5-dicas',
    tags: ['engenharia de prompt', 'produtividade com IA', 'avançado'],
  },
  {
    id: 3,
    title: 'As 10 Melhores Ferramentas de IA para Desenvolvedores em 2025',
    slug: '10-ferramentas-ia-desenvolvedores',
    tags: ['ferramentas de IA', 'desenvolvimento', 'avançado'],
  },
  {
    id: 4,
    title: 'Como Construir uma Carreira em Inteligência Artificial',
    slug: 'carreira-em-inteligencia-artificial',
    tags: ['carreira', 'iniciante'],
  },
];
