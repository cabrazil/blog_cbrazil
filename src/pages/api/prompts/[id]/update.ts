import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { name, content } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (!name || !content) {
      return res.status(400).json({ error: 'Nome e conteúdo são obrigatórios' });
    }

    try {
      const updatedPrompt = await prisma.aiPrompt.update({
        where: { id },
        data: {
          name,
          content,
          updatedAt: new Date(),
        },
      });
      return res.status(200).json(updatedPrompt);
    } catch (error) {
      console.error('Erro ao atualizar prompt:', error);
      return res.status(500).json({ error: 'Erro ao atualizar prompt' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
} 