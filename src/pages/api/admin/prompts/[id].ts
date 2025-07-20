import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const promptId = parseInt(id as string);

  if (isNaN(promptId)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    switch (req.method) {
      case "GET":
        const prompt = await prisma.aiPrompt.findFirst({
          where: { id: promptId, blogId: 1 },
        });

        if (!prompt) {
          return res.status(404).json({ message: "Prompt não encontrado" });
        }

        return res.status(200).json(prompt);

      case "PUT":
        const { name, content, isActive } = req.body;

        if (!name || !content) {
          return res.status(400).json({ message: "Nome e conteúdo são obrigatórios" });
        }

        const updatedPrompt = await prisma.aiPrompt.update({
          where: { id: promptId, blogId: 1 },
          data: {
            name,
            content,
            isActive: isActive ?? true,
          },
        });

        return res.status(200).json(updatedPrompt);

      case "DELETE":
        await prisma.aiPrompt.delete({
          where: { id: promptId, blogId: 1 },
        });

        res.status(204).end();
        break;

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return res.status(500).json({ 
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  } finally {
    await prisma.$disconnect();
  }
} 