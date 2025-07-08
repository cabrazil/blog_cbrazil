import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id: idString } = req.query;
    const id = parseInt(idString as string);

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      await prisma.aiPrompt.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Erro ao deletar prompt:', error);
      return res.status(500).json({ error: 'Erro ao deletar prompt' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
} 