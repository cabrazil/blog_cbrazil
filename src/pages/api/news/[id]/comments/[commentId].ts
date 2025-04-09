import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, commentId } = req.query;
  const articleId = Number(id);
  const commentIdNumber = Number(commentId);

  if (isNaN(articleId) || isNaN(commentIdNumber)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { content } = req.body;

        if (!content) {
          return res.status(400).json({ error: 'Conteúdo é obrigatório' });
        }

        const comment = await prisma.comment.update({
          where: {
            id: commentIdNumber,
            articleId,
          },
          data: {
            content,
          },
          include: {
            author: true,
          },
        });

        return res.status(200).json(comment);
      } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    case 'DELETE':
      try {
        await prisma.comment.delete({
          where: {
            id: commentIdNumber,
            articleId,
          },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Erro ao excluir comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }
} 