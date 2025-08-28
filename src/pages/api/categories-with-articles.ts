import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obter blogId da query string com fallback para variáveis de ambiente
    const blogId = Number(req.query.blogId || process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1);
    const categories = await prisma.category.findMany({
      where: {
        blogId: blogId,
        articles: {
          some: {
            published: true,
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias com artigos:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  } finally {
    await prisma.$disconnect();
  }
} 