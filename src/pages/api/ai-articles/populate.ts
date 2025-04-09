import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // Verificar se já existe uma categoria para IA para iniciantes
    let category = await prisma.category.findFirst({
      where: {
        title: "IA para Iniciantes",
      },
    });

    // Se não existir, criar a categoria
    if (!category) {
      category = await prisma.category.create({
        data: {
          title: "IA para Iniciantes",
          slug: "ia-para-iniciantes",
          description: "Artigos sobre Inteligência Artificial para quem está começando",
          aiKeywords: ["inteligência artificial", "machine learning", "deep learning", "iniciantes", "básico", "fundamentos"],
        },
      });
    }

    // Verificar se já existe um autor para artigos gerados por IA
    let author = await prisma.author.findFirst({
      where: {
        name: "Assistente IA",
      },
    });

    // Se não existir, criar o autor
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: "Assistente IA",
          role: "Especialista em IA",
          imageUrl: "https://ui-avatars.com/api/?name=Assistente+IA&background=0D8ABC&color=fff",
          bio: "Assistente virtual especializado em Inteligência Artificial",
          isAi: true,
        },
      });
    }

    // Lista de tópicos para artigos sobre IA para iniciantes
    const topics = [
      {
        title: "O que é Inteligência Artificial?",
        description: "Uma introdução aos conceitos básicos de Inteligência Artificial e como ela está transformando o mundo.",
        content: `# O que é Inteligência Artificial?

A Inteligência Artificial (IA) é um campo da ciência da computação que se concentra no desenvolvimento de sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana. Essas tarefas incluem reconhecimento de padrões, tomada de decisões, resolução de problemas e até mesmo compreensão da linguagem natural.

## Conceitos Básicos

A IA pode ser dividida em duas categorias principais:

1. **IA Estreita (ou Fraca)**: Projetada para realizar uma tarefa específica, como reconhecimento facial ou recomendação de produtos.
2. **IA Geral (ou Forte)**: Um sistema hipotético que pode realizar qualquer tarefa intelectual que um ser humano possa fazer.

## Aplicações da IA

A IA já está presente em muitas áreas da nossa vida:

- **Assistentes Virtuais**: Siri, Alexa e Google Assistant
- **Recomendações de Conteúdo**: Netflix, Spotify e YouTube
- **Carros Autônomos**: Tesla, Waymo e outros
- **Diagnóstico Médico**: Sistemas que ajudam médicos a identificar doenças
- **Chatbots**: Atendimento ao cliente automatizado

## Como a IA Funciona

A IA utiliza algoritmos e modelos matemáticos para processar grandes volumes de dados e identificar padrões. Alguns dos principais conceitos incluem:

- **Machine Learning**: Sistemas que aprendem com dados sem serem explicitamente programados
- **Deep Learning**: Uma subárea do Machine Learning que utiliza redes neurais artificiais
- **Processamento de Linguagem Natural**: Permite que computadores entendam e gerem linguagem humana
- **Visão Computacional**: Capacidade de sistemas de "ver" e interpretar imagens

## Desafios e Considerações Éticas

A IA também apresenta desafios importantes:

- **Privacidade**: Coleta e uso de dados pessoais
- **Viés**: Sistemas que podem refletir preconceitos presentes nos dados de treinamento
- **Desemprego**: Automação de tarefas que antes eram realizadas por humanos
- **Controle**: Quem controla sistemas de IA poderosos?

## Conclusão

A Inteligência Artificial está transformando rapidamente o mundo em que vivemos. Entender seus conceitos básicos é essencial para navegar neste novo cenário tecnológico. À medida que a IA continua a evoluir, será cada vez mais importante que todos tenham uma compreensão básica de como ela funciona e seus impactos na sociedade.`,
        imageUrl: "https://source.unsplash.com/random/800x600/?artificial-intelligence",
        keywords: ["inteligência artificial", "IA", "conceitos básicos", "iniciantes", "fundamentos"],
      },
      {
        title: "Machine Learning para Iniciantes",
        description: "Uma introdução ao Machine Learning, seus tipos e aplicações práticas para quem está começando.",
        content: `# Machine Learning para Iniciantes

Machine Learning (Aprendizado de Máquina) é uma subárea da Inteligência Artificial que permite que sistemas computacionais aprendam com dados sem serem explicitamente programados para realizar uma tarefa específica.

## O que é Machine Learning?

Em vez de seguir instruções pré-programadas, sistemas de Machine Learning identificam padrões nos dados e usam esses padrões para fazer previsões ou tomar decisões. É como ensinar um computador a aprender com exemplos, similar à forma como os humanos aprendem com a experiência.

## Tipos de Machine Learning

Existem três tipos principais de Machine Learning:

### 1. Aprendizado Supervisionado

Neste tipo, o algoritmo é treinado com dados que incluem as respostas corretas (rótulos). O objetivo é aprender a mapear entradas para saídas.

**Exemplos:**
- Classificação de e-mails como spam ou não-spam
- Previsão de preços de imóveis
- Reconhecimento de imagens

### 2. Aprendizado Não Supervisionado

Aqui, os dados não têm rótulos. O algoritmo deve encontrar padrões ou estruturas nos dados por conta própria.

**Exemplos:**
- Segmentação de clientes
- Detecção de anomalias
- Redução de dimensionalidade

### 3. Aprendizado por Reforço

O algoritmo aprende interagindo com um ambiente e recebendo recompensas ou penalidades por suas ações.

**Exemplos:**
- Jogos de tabuleiro
- Robótica
- Otimização de recursos

## Algoritmos Populares

Alguns dos algoritmos mais comuns incluem:

- **Regressão Linear**: Para previsões numéricas
- **Árvores de Decisão**: Para classificação e regressão
- **Redes Neurais**: Para problemas complexos como reconhecimento de imagens
- **K-Means**: Para agrupamento de dados
- **SVM (Support Vector Machines)**: Para classificação

## Aplicações Práticas

O Machine Learning já está presente em muitas áreas:

- **Recomendações**: Netflix, Amazon, Spotify
- **Detecção de Fraude**: Bancos e instituições financeiras
- **Diagnóstico Médico**: Ajuda a médicos a identificar doenças
- **Carros Autônomos**: Reconhecimento de objetos e navegação
- **Assistentes Virtuais**: Siri, Alexa, Google Assistant

## Como Começar

Se você está interessado em aprender Machine Learning, aqui estão alguns passos:

1. **Aprenda os fundamentos**: Estatística, probabilidade e álgebra linear
2. **Escolha uma linguagem**: Python é a mais popular para Machine Learning
3. **Familiarize-se com bibliotecas**: scikit-learn, TensorFlow, PyTorch
4. **Pratique com datasets**: Kaggle é um ótimo recurso
5. **Comece com projetos simples**: Classificação básica ou regressão

## Conclusão

Machine Learning é um campo fascinante e em constante evolução. Com as ferramentas e recursos disponíveis hoje, qualquer pessoa com interesse e dedicação pode começar a explorar este mundo. O importante é começar com os conceitos básicos e ir progredindo gradualmente para tópicos mais avançados.`,
        imageUrl: "https://source.unsplash.com/random/800x600/?machine-learning",
        keywords: ["machine learning", "aprendizado de máquina", "algoritmos", "iniciantes", "tipos de machine learning"],
      },
      {
        title: "Deep Learning: Redes Neurais para Iniciantes",
        description: "Uma introdução ao Deep Learning e redes neurais artificiais para quem está começando no mundo da IA.",
        content: `# Deep Learning: Redes Neurais para Iniciantes

Deep Learning (Aprendizado Profundo) é uma subárea do Machine Learning que utiliza redes neurais artificiais com múltiplas camadas para processar dados complexos e realizar tarefas que antes eram consideradas impossíveis para máquinas.

## O que é Deep Learning?

Deep Learning é inspirado na estrutura e função do cérebro humano. Ele utiliza redes neurais artificiais com muitas camadas (por isso "deep" ou profundo) para aprender representações hierárquicas dos dados.

## Redes Neurais Artificiais

Uma rede neural artificial é composta por:

- **Neurônios**: Unidades de processamento que recebem entradas, aplicam pesos e uma função de ativação
- **Camadas**: Conjuntos de neurônios organizados em camadas de entrada, camadas ocultas e camada de saída
- **Conexões**: Ligações entre neurônios que transmitem sinais
- **Pesos**: Valores que determinam a força das conexões
- **Funções de Ativação**: Funções não-lineares que introduzem complexidade ao modelo

## Tipos de Redes Neurais

Existem vários tipos de redes neurais, cada uma adequada para diferentes tipos de problemas:

### 1. Redes Neurais Feedforward

A forma mais básica, onde a informação flui apenas em uma direção, da entrada para a saída.

### 2. Redes Neurais Convolucionais (CNN)

Especializadas em processamento de imagens, utilizam camadas convolucionais para detectar padrões visuais.

### 3. Redes Neurais Recorrentes (RNN)

Projetadas para processar sequências de dados, como texto ou séries temporais, mantendo um "estado" interno.

### 4. Redes de Memória de Longo Prazo (LSTM)

Uma variação das RNNs, especialmente boa para capturar dependências de longo prazo em sequências.

### 5. Redes Gerativas Adversariais (GAN)

Utilizam duas redes neurais que competem entre si para gerar dados realistas.

## Aplicações do Deep Learning

O Deep Learning revolucionou várias áreas:

- **Visão Computacional**: Reconhecimento facial, detecção de objetos, segmentação de imagens
- **Processamento de Linguagem Natural**: Tradução, geração de texto, análise de sentimentos
- **Reconhecimento de Fala**: Assistentes virtuais, transcrição automática
- **Jogos**: AlphaGo, Dota 2, StarCraft II
- **Arte e Música**: Geração de imagens, composição musical

## Como o Deep Learning Funciona

O processo básico envolve:

1. **Coleta de Dados**: Grandes volumes de dados de treinamento
2. **Pré-processamento**: Limpeza e preparação dos dados
3. **Treinamento**: Ajuste dos pesos da rede para minimizar o erro
4. **Avaliação**: Teste do modelo com dados não vistos
5. **Inferência**: Uso do modelo treinado para fazer previsões

## Desafios do Deep Learning

- **Dados**: Necessidade de grandes volumes de dados de treinamento
- **Computação**: Requer hardware especializado (GPUs, TPUs)
- **Interpretabilidade**: Difícil entender como o modelo toma decisões
- **Overfitting**: Modelo que memoriza os dados em vez de generalizar

## Como Começar com Deep Learning

1. **Fundamentos**: Aprenda álgebra linear, cálculo e probabilidade
2. **Frameworks**: Familiarize-se com TensorFlow, PyTorch ou Keras
3. **Projetos Práticos**: Comece com datasets simples como MNIST
4. **Recursos Online**: Cursos como Coursera, Fast.ai, ou DeepLearning.AI
5. **Comunidade**: Participe de fóruns e grupos de discussão

## Conclusão

Deep Learning é um campo empolgante que continua a evoluir rapidamente. Embora possa parecer complexo no início, com os recursos certos e uma abordagem gradual, qualquer pessoa pode começar a explorar este mundo fascinante. O importante é começar com os conceitos básicos e ir progredindo para tópicos mais avançados à medida que sua compreensão aumenta.`,
        imageUrl: "https://source.unsplash.com/random/800x600/?neural-network",
        keywords: ["deep learning", "redes neurais", "aprendizado profundo", "iniciantes", "arquiteturas de redes neurais"],
      },
    ];

    // Criar artigos para cada tópico
    const articles = [];

    for (const topic of topics) {
      // Verificar se o artigo já existe
      const existingArticle = await prisma.article.findFirst({
        where: {
          title: topic.title,
        },
      });

      if (!existingArticle) {
        // Criar o artigo
        const article = await prisma.article.create({
          data: {
            title: topic.title,
            content: topic.content,
            description: topic.description,
            imageUrl: topic.imageUrl,
            slug: slugify(topic.title),
            published: true,
            categoryId: category.id,
            authorId: author.id,
            aiGenerated: true,
            aiModel: "manual",
            aiConfidence: 1.0,
            keywords: topic.keywords,
          },
        });

        articles.push(article);
      }
    }

    return res.status(200).json({
      message: `${articles.length} artigos criados com sucesso`,
      articles,
    });
  } catch (error) {
    console.error("Erro ao popular artigos:", error);
    return res.status(500).json({ 
      message: "Erro ao popular artigos", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
} 