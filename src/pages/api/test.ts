import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Verificar se o Prisma está conectado
    const articleCount = await prisma.article.count();
    
    // Buscar um artigo para verificar a estrutura
    const article = await prisma.article.findFirst({
      include: {
        author: true,
        category: true,
      },
    });

    return res.status(200).json({
      message: "API funcionando corretamente",
      articleCount,
      article,
      schema: {
        article: Object.keys(prisma.article.fields),
        author: Object.keys(prisma.author.fields),
        category: Object.keys(prisma.category.fields),
      }
    });
  } catch (error) {
    console.error("Erro ao testar API:", error);
    return res.status(500).json({ 
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    await prisma.$disconnect();
  }
} 