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
    const { topic, count = 1, promptId, categoryId } = req.body;
    console.log("API: Dados recebidos:", { topic, count, promptId, categoryId });

    if (!topic) {
      console.log("API: Tópico não fornecido");
      return res.status(400).json({ message: "O tópico é obrigatório" });
    }

    if (!categoryId) {
      console.log("API: Categoria não fornecida");
      return res.status(400).json({ message: "A categoria é obrigatória" });
    }

    // Buscar a categoria selecionada
    console.log("API: Verificando categoria...");
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      console.log("API: Categoria não encontrada");
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    console.log("API: Categoria encontrada:", category);

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
        ? `${prompt.content}\n\nGere um título conciso e impactante para um artigo sobre: ${topic}. O título deve ter no máximo 8 palavras, ser atraente para o público-alvo e NÃO deve começar com a palavra "Título" ou conter essa palavra em nenhum lugar do texto. O título deve ser uma única linha, sem descrição ou texto adicional.`
        : `Gere um título conciso e impactante para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O título deve ter no máximo 8 palavras, ser atraente para iniciantes e NÃO deve começar com a palavra "Título" ou conter essa palavra em nenhum lugar do texto. O título deve ser uma única linha, sem descrição ou texto adicional.`;
      
      const titleResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: titlePrompt }],
        max_tokens: 50,
      });
      
      const title = titleResponse.choices[0]?.message?.content?.trim() || `Artigo sobre ${topic}`;
      console.log("API: Título gerado:", title);

      // Gerar descrição
      console.log("API: Gerando descrição...");
      const descriptionPrompt = prompt 
        ? `${prompt.content}\n\nGere uma descrição curta e direta para um artigo sobre: ${topic}. A descrição deve ter no máximo 100 caracteres e ser impactante. A descrição deve ser uma única linha, sem incluir a palavra "Descrição" ou "Título".`
        : `Gere uma descrição curta e direta (máximo 100 caracteres) para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. A descrição deve ser impactante. A descrição deve ser uma única linha, sem incluir a palavra "Descrição" ou "Título".`;
      
      const descriptionResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: descriptionPrompt }],
        max_tokens: 50,
      });
      
      const description = descriptionResponse.choices[0]?.message?.content?.trim() || `Descrição do artigo sobre ${topic}`;
      console.log("API: Descrição gerada:", description);

      // Gerar conteúdo
      console.log("API: Gerando conteúdo...");
      const contentPrompt = prompt 
        ? `${prompt.content}\n\nGere um artigo completo sobre: ${topic}. O artigo deve ser bem estruturado, mas NÃO deve incluir o título no início do texto. Comece diretamente com a introdução do artigo, sem repetir o título que já foi gerado anteriormente.`
        : `Escreva um artigo completo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O artigo deve ser informativo, bem estruturado e fácil de entender para pessoas sem conhecimento técnico. NÃO inclua o título no início do texto. Comece diretamente com a introdução do artigo, sem repetir o título que já foi gerado anteriormente.`;
      
      const contentResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: contentPrompt }],
        max_tokens: 2000,
      });
      
      const content = contentResponse.choices[0]?.message?.content?.trim() || `Conteúdo do artigo sobre ${topic}`;
      console.log("API: Conteúdo gerado (primeiros 100 caracteres):", content.substring(0, 100));

      // Gerar descrição da imagem
      console.log("API: Gerando descrição da imagem...");
      const imagePrompt = `Gere uma descrição curta e específica para uma imagem que represente visualmente o tema: ${topic} em um artigo sobre Inteligência Artificial. 
      A descrição deve ser focada em elementos visuais relacionados a IA, como:
      - Circuitos neurais ou redes neurais
      - Robôs ou assistentes virtuais
      - Código ou algoritmos
      - Interfaces de usuário modernas
      - Visualizações de dados
      - Elementos futuristas ou tecnológicos
      
      Evite descrições genéricas ou que não tenham relação direta com IA.`;
      
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
          title: title,
          slug: slugify(title),
          description: description,
          content: content,
          imageUrl: imageUrl || DEFAULT_ARTICLE_IMAGE,
          categoryId: category.id,
          authorId: author.id,
          date: new Date(),
          published: true,
          aiGenerated: true,
          aiModel: "gpt-4",
          aiPrompt: contentPrompt,
          keywords: category.aiKeywords || [],
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