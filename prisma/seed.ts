import { PrismaClient } from '@prisma/client';
import { categories } from '../src/utils/dataCategories';
import { aiPrompts } from '../src/utils/aiPrompts';
import { getRandomImage } from '../src/config/unsplash';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar autores
  console.log('Criando autores...');
  
  const authors = [
    {
      name: 'Ana Silva',
      role: 'Especialista em IA',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      email: 'ana.silva@exemplo.com',
      bio: 'Especialista em Inteligência Artificial com mais de 10 anos de experiência em Machine Learning e Deep Learning.',
      website: 'https://anasilva.dev',
      skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'PyTorch'],
      isAi: false
    },
    {
      name: 'Carlos Oliveira',
      role: 'Desenvolvedor Full Stack',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      email: 'carlos.oliveira@exemplo.com',
      bio: 'Desenvolvedor Full Stack com experiência em React, Node.js e arquiteturas de microsserviços.',
      website: 'https://carlosoliveira.dev',
      skills: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
      isAi: false
    },
    {
      name: 'Mariana Costa',
      role: 'Cientista de Dados',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
      email: 'mariana.costa@exemplo.com',
      bio: 'Cientista de Dados com foco em análise preditiva e visualização de dados.',
      website: 'https://marianacosta.dev',
      skills: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
      isAi: false
    },
    {
      name: 'Roberto Almeida',
      role: 'Especialista em Tecnologias Emergentes',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
      email: 'roberto.almeida@exemplo.com',
      bio: 'Especialista em tecnologias emergentes como Blockchain, IoT e Realidade Aumentada.',
      website: 'https://robertoalmeida.dev',
      skills: ['Blockchain', 'IoT', 'AR/VR', 'Smart Contracts', 'Ethereum'],
      isAi: false
    },
    {
      name: 'Juliana Santos',
      role: 'Mentora de Carreira em Tech',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana',
      email: 'juliana.santos@exemplo.com',
      bio: 'Mentora de carreira especializada em ajudar profissionais de tecnologia a alcançarem seu potencial máximo.',
      website: 'https://julianasantos.dev',
      skills: ['Mentoria', 'Desenvolvimento de Carreira', 'Liderança', 'Comunicação', 'Networking'],
      isAi: false
    },
    {
      name: 'IA Editor',
      role: 'Editor de Conteúdo',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=IAEditor',
      email: 'ia.editor@exemplo.com',
      bio: 'Editor de conteúdo gerado por IA, especializado em criar artigos informativos e envolventes.',
      website: 'https://iaeditor.dev',
      skills: ['Processamento de Linguagem Natural', 'Geração de Texto', 'Edição', 'SEO'],
      isAi: true,
      aiModel: 'GPT-4'
    }
  ];

  const createdAuthors = [];
  
  for (const authorData of authors) {
    console.log(`Verificando autor: ${authorData.name}`);
    
    // Verificar se o autor já existe
    const existingAuthor = await prisma.author.findUnique({
      where: { email: authorData.email }
    });
    
    if (existingAuthor) {
      console.log(`Autor já existe: ${existingAuthor.name} (ID: ${existingAuthor.id})`);
      createdAuthors.push(existingAuthor);
      continue;
    }
    
    console.log(`Criando autor: ${authorData.name}`);
    
    const author = await prisma.author.create({
      data: authorData
    });
    
    console.log(`Autor criado: ${author.name} (ID: ${author.id})`);
    createdAuthors.push(author);
  }

  // Verificar se já existem categorias
  const existingCategories = await prisma.category.findMany();
  
  if (existingCategories.length > 0) {
    console.log('Categorias já existem, pulando criação...');
  } else {
    // Criar categorias
    const createdCategories = [];
    
    for (const categoryData of categories) {
      const categoryName = categoryData.category;
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
      console.log(`Criando categoria: ${categoryName}`);
      
      const category = await prisma.category.create({
        data: {
          title: categoryName,
          slug: categorySlug,
          description: `Artigos sobre ${categoryName}`,
          aiKeywords: categoryData.subcategories,
        },
      });
      
      console.log(`Categoria criada: ${category.title} (ID: ${category.id})`);
      createdCategories.push(category);
      
      // Criar subcategorias como tags
      for (const subcategory of categoryData.subcategories) {
        const tagSlug = subcategory.toLowerCase().replace(/\s+/g, '-');
        
        console.log(`Criando tag: ${subcategory}`);
        
        const tag = await prisma.tag.create({
          data: {
            name: subcategory,
            slug: tagSlug,
            aiRelated: true,
          },
        });
        
        console.log(`Tag criada: ${tag.name} (ID: ${tag.id})`);
      }
    }
  }

  // Verificar se já existem prompts
  const existingPrompts = await prisma.aiPrompt.findMany();
  
  if (existingPrompts.length > 0) {
    console.log('Prompts já existem, pulando criação...');
  } else {
    // Criar prompts de IA
    console.log('Criando prompts de IA...');
    
    const createdPrompts = [];
    
    for (const promptData of aiPrompts) {
      console.log(`Criando prompt: ${promptData.name}`);
      
      const prompt = await prisma.aiPrompt.create({
        data: {
          name: promptData.name,
          content: promptData.content,
          isActive: promptData.isActive,
          metadata: promptData.metadata,
        },
      });
      
      console.log(`Prompt criado: ${prompt.name} (ID: ${prompt.id})`);
      createdPrompts.push(prompt);
    }
  }

  // Verificar se já existem artigos
  const existingArticles = await prisma.article.findMany();
  
  if (existingArticles.length > 0) {
    console.log('Artigos já existem, pulando criação...');
  } else {
    // Criar um artigo de exemplo
    console.log('Criando artigo de exemplo...');
    
    // Buscar algumas tags para o artigo
    const machineLearningTag = await prisma.tag.findFirst({
      where: { name: 'Machine Learning' }
    });
    
    const deepLearningTag = await prisma.tag.findFirst({
      where: { name: 'Deep Learning' }
    });
    
    const aiCategory = await prisma.category.findFirst({
      where: { title: 'Inteligência Artificial' }
    });
    
    const aiAuthor = await prisma.author.findFirst({
      where: { name: 'Ana Silva' }
    });
    
    if (machineLearningTag && deepLearningTag && aiCategory && aiAuthor) {
      const imageUrl = await getRandomImage('artificial intelligence technology');
      
      const article = await prisma.article.create({
        data: {
          title: 'Como a IA está Transformando o Desenvolvimento de Software',
          content: `# Introdução ao Machine Learning e Deep Learning

O Machine Learning e o Deep Learning são duas áreas fundamentais da Inteligência Artificial que estão transformando a forma como interagimos com a tecnologia e como as empresas tomam decisões.

## O que é Machine Learning?

Machine Learning é um subcampo da Inteligência Artificial que se concentra no desenvolvimento de sistemas que podem aprender com dados e melhorar com a experiência, sem serem explicitamente programados para isso. Em vez de seguir instruções pré-definidas, os algoritmos de Machine Learning identificam padrões nos dados e fazem previsões ou decisões com base nesses padrões.

### Tipos de Machine Learning

1. **Aprendizado Supervisionado**: O algoritmo é treinado com dados rotulados, onde cada exemplo inclui a entrada e a saída esperada. O objetivo é aprender a mapear entradas para saídas.

2. **Aprendizado Não Supervisionado**: O algoritmo é treinado com dados não rotulados e deve encontrar padrões ou estruturas nos dados sem orientação externa.

3. **Aprendizado por Reforço**: O algoritmo aprende interagindo com um ambiente e recebendo feedback na forma de recompensas ou penalidades.

## O que é Deep Learning?

Deep Learning é um subcampo do Machine Learning que utiliza redes neurais artificiais com múltiplas camadas (por isso "deep") para processar dados de formas complexas. Essas redes são inspiradas na estrutura do cérebro humano e são capazes de aprender representações hierárquicas de dados.

### Arquiteturas de Deep Learning

1. **Redes Neurais Convolucionais (CNNs)**: Especializadas em processamento de imagens e reconhecimento de padrões visuais.

2. **Redes Neurais Recorrentes (RNNs)**: Projetadas para processar sequências de dados, como texto ou séries temporais.

3. **Transformers**: Arquitetura mais recente que revolucionou o processamento de linguagem natural e outras áreas.

## Aplicações Práticas

Tanto o Machine Learning quanto o Deep Learning têm inúmeras aplicações práticas:

- **Reconhecimento de Imagens**: Identificação de objetos, pessoas e cenas em imagens.
- **Processamento de Linguagem Natural**: Tradução automática, chatbots, análise de sentimentos.
- **Sistemas de Recomendação**: Recomendações personalizadas em plataformas de streaming, e-commerce, etc.
- **Detecção de Fraudes**: Identificação de transações suspeitas em sistemas financeiros.
- **Veículos Autônomos**: Percepção e navegação em ambientes complexos.

## Desafios e Tendências Futuras

Apesar dos avanços significativos, ainda existem desafios importantes:

- **Interpretabilidade**: Muitos modelos de Deep Learning são "caixas pretas" difíceis de interpretar.
- **Dados de Qualidade**: A qualidade e quantidade de dados de treinamento são cruciais para o desempenho dos modelos.
- **Viés e Equidade**: Garantir que os modelos não perpetuem ou amplifiquem preconceitos presentes nos dados de treinamento.

As tendências futuras incluem:

- **Aprendizado Federado**: Treinamento de modelos distribuídos que preservam a privacidade dos dados.
- **Aprendizado por Poucos Exemplos**: Desenvolvimento de modelos que aprendem com poucos exemplos, como os humanos.
- **IA Explicável**: Criação de modelos mais transparentes e interpretáveis.

## Conclusão

Machine Learning e Deep Learning continuarão a evoluir e transformar diversos setores da sociedade. Compreender esses conceitos fundamentais é essencial para profissionais de tecnologia e para qualquer pessoa interessada no futuro da IA.

À medida que essas tecnologias se tornam mais acessíveis e poderosas, é importante considerar não apenas suas capacidades, mas também suas implicações éticas e sociais.`,
          description: 'Uma introdução abrangente aos conceitos de Machine Learning e Deep Learning, suas aplicações práticas e tendências futuras.',
          imageUrl: imageUrl,
          categoryId: aiCategory.id,
          authorId: aiAuthor.id,
          slug: 'introducao-ao-machine-learning-e-deep-learning',
          published: true,
          keywords: ['Machine Learning', 'Deep Learning', 'Inteligência Artificial', 'Redes Neurais', 'Aprendizado de Máquina'],
          aiGenerated: false
        },
      });

      console.log(`Artigo criado: ${article.title} (ID: ${article.id})`);
      
      // Conectar o artigo às tags
      await prisma.article.update({
        where: { id: article.id },
        data: {
          tags: {
            connect: [
              { id: machineLearningTag.id },
              { id: deepLearningTag.id }
            ]
          }
        }
      });
      
      console.log('Tags conectadas ao artigo com sucesso!');
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 