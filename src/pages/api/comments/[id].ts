import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const commentId = Number(id);

  if (isNaN(commentId)) {
    return res.status(400).json({ error: 'ID do comentário inválido' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
          include: {
            author: true,
          },
        });

        if (!comment) {
          return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        return res.status(200).json(comment);
      } catch (error) {
        console.error('Erro ao buscar comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    case 'PUT':
      try {
        const { content } = req.body;

        if (!content) {
          return res.status(400).json({ error: 'Conteúdo é obrigatório' });
        }

        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: { content },
          include: {
            author: true,
          },
        });

        return res.status(200).json(updatedComment);
      } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    case 'DELETE':
      try {
        await prisma.comment.delete({
          where: { id: commentId },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }
} 