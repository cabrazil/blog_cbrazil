import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Busca os artigos com suas relações
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        category: true,
        tags: true
      },
      orderBy: {
        date: "desc"
      }
    });
    
    // Log apenas do número de artigos encontrados
    console.log(`Artigos encontrados: ${articles.length}`);
    
    return res.status(200).json(articles);
  } catch (error) {
    // Log de erro mais conciso
    console.error("Erro ao buscar artigos:", error instanceof Error ? error.message : "Erro desconhecido");
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    // Desconecta do banco de dados
    await prisma.$disconnect();
  }
} 