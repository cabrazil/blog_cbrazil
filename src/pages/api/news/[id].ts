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
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: true,
        category: true,
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Artigo não encontrado" });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error("Erro ao buscar artigo:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    await prisma.$disconnect();
  }
} 