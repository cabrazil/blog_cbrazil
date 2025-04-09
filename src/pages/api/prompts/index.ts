import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const prompts = await prisma.aiPrompt.findMany({
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(prompts);
    } catch (error) {
      console.error('Erro ao buscar prompts:', error);
      return res.status(500).json({ error: 'Erro ao buscar prompts' });
    }
  }

  if (req.method === 'POST') {
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Nome e conteúdo são obrigatórios' });
    }

    try {
      const prompt = await prisma.aiPrompt.create({
        data: {
          name,
          content,
        },
      });
      return res.status(201).json(prompt);
    } catch (error) {
      console.error('Erro ao criar prompt:', error);
      return res.status(500).json({ error: 'Erro ao criar prompt' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
} 