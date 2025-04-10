import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";
import { slugify } from "@/utils/slugify";
import { getRandomImage } from "@/config/unsplash";

// Inicializar o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// URLs das imagens padrão
const DEFAULT_ARTICLE_IMAGE = "/images/default-article.svg";
const DEFAULT_AUTHOR_IMAGE = "/images/default-avatar.svg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API: Iniciando requisição");
  console.log("API: Método:", req.method);
  console.log("API: Body:", req.body);

  if (req.method !== "POST") {
    console.log("API: Método não permitido");
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { topic, count = 1, promptId } = req.body;
    console.log("API: Dados recebidos:", { topic, count, promptId });

    if (!topic) {
      console.log("API: Tópico não fornecido");
      return res.status(400).json({ message: "O tópico é obrigatório" });
    }

    // Verificar se a categoria "IA para Iniciantes" existe
    console.log("API: Verificando categoria...");
    let category = await prisma.category.findFirst({
      where: {
        title: "IA para Iniciantes",
      },
    });
    console.log("API: Categoria encontrada:", category);

    if (!category) {
      console.log("API: Criando nova categoria...");
      category = await prisma.category.create({
        data: {
          title: "IA para Iniciantes",
          slug: "ia-para-iniciantes",
          description: "Artigos sobre Inteligência Artificial para iniciantes",
          aiKeywords: ["ia", "inteligência artificial", "iniciantes", "básico", "fundamentos"],
        },
      });
      console.log("API: Nova categoria criada:", category);
    }

    // Verificar se o autor "Assistente IA" existe
    console.log("API: Verificando autor...");
    let author = await prisma.author.findFirst({
      where: {
        name: "Assistente IA",
      },
    });
    console.log("API: Autor encontrado:", author);

    if (!author) {
      console.log("API: Criando novo autor...");
      author = await prisma.author.create({
        data: {
          name: "Assistente IA",
          role: "Especialista em IA",
          imageUrl: DEFAULT_AUTHOR_IMAGE,
          bio: "Assistente especializado em Inteligência Artificial, criado para gerar conteúdo educativo sobre IA.",
          isAi: true,
          aiModel: "gpt-4",
        },
      });
      console.log("API: Novo autor criado:", author);
    }

    // Obter o prompt se um ID foi fornecido
    let prompt = null;
    if (promptId) {
      console.log("API: Buscando prompt:", promptId);
      prompt = await prisma.aiPrompt.findUnique({
        where: {
          id: promptId,
        },
      });
      console.log("API: Prompt encontrado:", prompt);
    }

    const articles = [];

    // Gerar artigos
    for (let i = 0; i < count; i++) {
      console.log(`API: Gerando artigo ${i + 1} de ${count}...`);
      
      // Gerar título
      console.log("API: Gerando título...");
      const titlePrompt = prompt 
        ? `${prompt.content}\n\nGere um título para um artigo sobre: ${topic}`
        : `Gere um título para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O título deve ser atraente e informativo.`;
      
      const titleResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: titlePrompt }],
        max_tokens: 100,
      });
      
      const title = titleResponse.choices[0]?.message?.content?.trim() || `Artigo sobre ${topic}`;
      console.log("API: Título gerado:", title);

      // Gerar descrição
      console.log("API: Gerando descrição...");
      const descriptionPrompt = prompt 
        ? `${prompt.content}\n\nGere uma breve descrição para um artigo sobre: ${topic}`
        : `Gere uma breve descrição (máximo 150 caracteres) para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}.`;
      
      const descriptionResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: descriptionPrompt }],
        max_tokens: 150,
      });
      
      const description = descriptionResponse.choices[0]?.message?.content?.trim() || `Descrição do artigo sobre ${topic}`;
      console.log("API: Descrição gerada:", description);

      // Gerar conteúdo
      console.log("API: Gerando conteúdo...");
      const contentPrompt = prompt 
        ? `${prompt.content}\n\nGere um artigo completo sobre: ${topic}`
        : `Escreva um artigo completo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O artigo deve ser informativo, bem estruturado e fácil de entender para pessoas sem conhecimento técnico.`;
      
      const contentResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: contentPrompt }],
        max_tokens: 2000,
      });
      
      const content = contentResponse.choices[0]?.message?.content?.trim() || `Conteúdo do artigo sobre ${topic}`;
      console.log("API: Conteúdo gerado (primeiros 100 caracteres):", content.substring(0, 100));

      // Gerar descrição da imagem
      console.log("API: Gerando descrição da imagem...");
      const imagePrompt = `Gere uma descrição curta para uma imagem que represente o tema: ${topic} em um artigo sobre Inteligência Artificial para iniciantes.`;
      
      const imageResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: imagePrompt }],
        max_tokens: 100,
      });
      
      const imageDescription = imageResponse.choices[0]?.message?.content?.trim() || "Imagem representativa de IA";
      console.log("API: Descrição da imagem gerada:", imageDescription);
      
      // Buscar imagem do Unsplash usando nossa função getRandomImage
      const imageUrl = await getRandomImage(imageDescription);
      console.log("API: URL da imagem final:", imageUrl);

      // Criar o artigo no banco de dados
      console.log("API: Criando artigo no banco de dados...");
      const article = await prisma.article.create({
        data: {
          title,
          content,
          description,
          imageUrl,
          slug: slugify(title),
          published: true,
          categoryId: category.id,
          authorId: author.id,
          aiGenerated: true,
          aiModel: "gpt-4",
          aiPrompt: prompt ? prompt.content : null,
          keywords: [topic, "ia", "inteligência artificial", "iniciantes"],
        },
      });
      console.log("API: Artigo criado:", article);

      articles.push(article);
    }

    console.log("API: Retornando resposta de sucesso");
    return res.status(200).json({
      message: "Artigos gerados com sucesso",
      articles,
    });
  } catch (error) {
    console.error("API: Erro detalhado:", error);
    return res.status(500).json({
      message: "Erro ao gerar artigos",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
} 