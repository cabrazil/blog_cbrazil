import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { articleId } = req.query;
        
        // Se articleId não for fornecido, retorna todos os comentários
        if (!articleId) {
          const comments = await prisma.comment.findMany({
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
          return res.status(200).json(comments);
        }

        // Valida se articleId é um número válido
        const articleIdNumber = Number(articleId);
        if (isNaN(articleIdNumber)) {
          return res.status(400).json({ error: 'ID do artigo inválido' });
        }

        // Busca comentários para o artigo específico
        const comments = await prisma.comment.findMany({
          where: {
            articleId: articleIdNumber
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
        const { content, articleId, authorId } = req.body;

        if (!content || !articleId || !authorId) {
          return res.status(400).json({ 
            error: 'Conteúdo, ID do artigo e ID do autor são obrigatórios' 
          });
        }

        const comment = await prisma.comment.create({
          data: {
            content,
            articleId: Number(articleId),
            authorId: Number(authorId),
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