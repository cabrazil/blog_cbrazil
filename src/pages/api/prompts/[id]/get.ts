import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const promptId = parseInt(id as string);

    if (isNaN(promptId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const prompt = await prisma.aiPrompt.findUnique({
      where: { id: promptId },
      include: {
        generationLogs: {
          select: {
            id: true,
            createdAt: true,
            success: true,
            tokensUsed: true,
            cost: true,
            duration: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Retorna apenas as 5 gerações mais recentes
        }
      }
    });

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt não encontrado' });
    }

    return res.status(200).json(prompt);
  } catch (error) {
    console.error('Erro ao buscar prompt:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
} 