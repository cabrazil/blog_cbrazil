import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // Verificar se é uma requisição do painel de administração
    const isAdmin = req.headers["x-admin-request"] === "true";
    
    // Buscar artigos
    const articles = await prisma.article.findMany({
      where: {
        // Se não for admin, mostrar apenas artigos publicados
        ...(isAdmin ? {} : { published: true }),
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    await prisma.$disconnect();
  }
} 