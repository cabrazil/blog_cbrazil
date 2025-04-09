import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const articleId = Number(id);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: 'ID do artigo inválido' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const comments = await prisma.comment.findMany({
          where: {
            articleId,
          },
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return res.status(200).json(comments);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    case 'POST':
      try {
        const { content, authorId } = req.body;

        if (!content || !authorId) {
          return res.status(400).json({ error: 'Conteúdo e autor são obrigatórios' });
        }

        const comment = await prisma.comment.create({
          data: {
            content,
            authorId,
            articleId,
          },
          include: {
            author: true,
          },
        });

        return res.status(201).json(comment);
      } catch (error) {
        console.error('Erro ao criar comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }
} 