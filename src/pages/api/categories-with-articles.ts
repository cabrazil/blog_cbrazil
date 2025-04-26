import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.category.findMany({
      where: {
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