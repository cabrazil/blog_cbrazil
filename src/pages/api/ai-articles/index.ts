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
    const { topic, count = 1, promptId, categoryId, authorId } = req.body;
    console.log("API: Dados recebidos:", { topic, count, promptId, categoryId, authorId });

    if (!topic) {
      console.log("API: Tópico não fornecido");
      return res.status(400).json({ message: "O tópico é obrigatório" });
    }

    if (!categoryId) {
      console.log("API: Categoria não fornecida");
      return res.status(400).json({ message: "A categoria é obrigatória" });
    }

    if (!authorId) {
      console.log("API: Autor não fornecido");
      return res.status(400).json({ message: "O autor é obrigatório" });
    }

    // Buscar a categoria selecionada
    console.log("API: Verificando categoria...");
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        blogId: 1, // Adicionado para multi-tenant
      },
    });

    if (!category) {
      console.log("API: Categoria não encontrada");
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    console.log("API: Categoria encontrada:", category);

    // Buscar o autor selecionado
    console.log("API: Verificando autor...");
    const author = await prisma.author.findFirst({
      where: {
        id: authorId,
        blogId: 1, // Adicionado para multi-tenant
      },
    });

    if (!author) {
      console.log("API: Autor não encontrado");
      return res.status(404).json({ message: "Autor não encontrado" });
    }
    console.log("API: Autor encontrado:", author);

    // Obter o prompt se um ID foi fornecido
    let prompt = null;
    if (promptId) {
      console.log("API: Buscando prompt:", promptId);
      prompt = await prisma.aiPrompt.findFirst({
        where: {
          id: promptId,
          blogId: 1, // Adicionado para multi-tenant
        },
      });
      console.log("API: Prompt encontrado:", prompt);
    }

    const articles = [];

    // Gerar artigos
    for (let i = 0; i < count; i++) {
      let title: string;
      let description: string;
      let content: string;
      let finalPrompt: string;

      if (prompt) {
        // Lógica para prompt personalizado
        console.log(`API: Gerando artigo ${i + 1} de ${count} com prompt personalizado...`);
        finalPrompt = prompt.content.replace('{topic}', topic);

        const fullContentResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: finalPrompt }],
          max_tokens: 4000,
        });

        const fullContent = fullContentResponse.choices[0]?.message?.content?.trim() || `Artigo sobre ${topic}`;
        // Extrair título do h1, sendo flexível com maiúsculas/minúsculas e atributos
        const titleMatch = fullContent.match(/<h1.*?>(.*?)<\/h1>/i);
        title = titleMatch ? titleMatch[1] : `Artigo sobre ${topic}`;

        // Extrair descrição do primeiro <p>
        const descriptionMatch = fullContent.match(/<p.*?>(.*?)<\/p>/i);
        description = descriptionMatch ? descriptionMatch[1] : fullContent.substring(0, 150);

        // Remover o h1 do conteúdo principal para evitar duplicidade no HTML final
        content = fullContent.replace(/<h1.*?>.*?<\/h1>/is, '').trim();

      } else {
        // Lógica de fallback (sem prompt personalizado)
        console.log(`API: Gerando artigo ${i + 1} de ${count} com lógica padrão...`);
        
        // Gerar título
        const titlePrompt = `Gere um título conciso e impactante para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O título deve ter no máximo 8 palavras, ser atraente para iniciantes e NÃO deve começar com a palavra "Título" ou conter essa palavra em nenhum lugar do texto. O título deve ser uma única linha, sem descrição ou texto adicional.`;
        const titleResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: titlePrompt }],
          max_tokens: 50,
        });
        title = titleResponse.choices[0]?.message?.content?.trim() || `Artigo sobre ${topic}`;

        // Gerar descrição
        const descriptionPrompt = `Gere uma descrição curta e direta (máximo 100 caracteres) para um artigo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. A descrição deve ser impactante. A descrição deve ser uma única linha, sem incluir a palavra "Descrição" ou "Título".`;
        const descriptionResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: descriptionPrompt }],
          max_tokens: 50,
        });
        description = descriptionResponse.choices[0]?.message?.content?.trim() || `Descrição do artigo sobre ${topic}`;

        // Gerar conteúdo
        finalPrompt = `Escreva um artigo completo sobre Inteligência Artificial para iniciantes sobre o tema: ${topic}. O título do artigo é: "${title}". A descrição do artigo é: "${description}". O artigo deve ser informativo, bem estruturado e fácil de entender para pessoas sem conhecimento técnico. NÃO inclua o título no início do texto. Comece diretamente com a introdução do artigo, sem repetir o título que já foi gerado anteriormente.`;
        const contentResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: finalPrompt }],
          max_tokens: 2000,
        });
        content = contentResponse.choices[0]?.message?.content?.trim() || `Conteúdo do artigo sobre ${topic}`;
      }

      console.log("API: Título gerado/extraído:", title);
      console.log("API: Descrição gerada/extraída:", description);
      // Processar placeholders de imagem
      const imagePlaceholderRegex = /\[IMAGEM:\s*"(.*?)"\]/g;
      const matches = [...content.matchAll(imagePlaceholderRegex)];

      if (matches.length > 0) {
        const imageReplacements = await Promise.all(matches.map(async (match) => {
          const placeholder = match[0];
          const imageDescription = match[1];
          const imageUrl = await getRandomImage(imageDescription);
          return { placeholder, html: `<p><img src="${imageUrl}" alt="${imageDescription}" class="w-full h-auto rounded-lg my-4" /></p>` };
        }));

        imageReplacements.forEach(({ placeholder, html }) => {
          content = content.replace(placeholder, html);
        });
      }

      console.log("API: Conteúdo gerado (primeiros 100 caracteres):", content.substring(0, 100));
      console.log("API: Conteúdo HTML completo gerado pela IA:\n", content);

      // Gerar descrição da imagem
      console.log("API: Gerando descrição da imagem...");
      const imagePrompt = `Gere uma descrição curta e específica para uma imagem que represente visualmente o tema: ${topic} em um artigo sobre Inteligência Artificial. A descrição deve ser focada em elementos visuais relacionados a IA.`;
      const imageResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: imagePrompt }],
        max_tokens: 100,
      });
      const imageDescription = imageResponse.choices[0]?.message?.content?.trim() || "Imagem representativa de IA";
      console.log("API: Descrição da imagem gerada:", imageDescription);
      
      // Buscar imagem do Unsplash
      const imageUrl = await getRandomImage(imageDescription);
      console.log("API: URL da imagem final:", imageUrl);

      // Criar o artigo no banco de dados
      console.log("API: Criando artigo no banco de dados...");
      const article = await prisma.article.create({
        data: {
          title: title,
          slug: slugify(title) + '-' + Date.now(),
          description: description,
          content: content,
          imageUrl: imageUrl || DEFAULT_ARTICLE_IMAGE,
          categoryId: category.id,
          authorId: author.id,
          date: new Date(),
          published: true,
          aiGenerated: true,
          aiModel: "gpt-4",
          aiPrompt: finalPrompt,
          keywords: category.aiKeywords || [],
          blogId: 1, // Adicionado para multi-tenant
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