import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { query, category, limit = 10, page = 1 } = req.query;
    
    // Obter blogId com fallback
    const blogId = Number(process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1);
    
    // Construir a query de busca
    const where: any = {
      published: true,
      blogId: blogId, // Adicionado para multi-tenant
    };
    
    // Filtrar por categoria
    if (category) {
      const categoryObj = await prisma.category.findFirst({
        where: {
          blogId: blogId, // Adicionado para multi-tenant
          OR: [
            { id: isNaN(Number(category)) ? undefined : Number(category) },
            { slug: String(category) },
          ],
        },
      });
      
      if (categoryObj) {
        where.categoryId = categoryObj.id;
      }
    }
    
    // Filtrar por texto de busca
    if (query) {
      where.OR = [
        { title: { contains: String(query), mode: 'insensitive' } },
        { description: { contains: String(query), mode: 'insensitive' } },
        { content: { contains: String(query), mode: 'insensitive' } },
        { keywords: { hasSome: [String(query)] } },
      ];
    }
    
    // Buscar artigos
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    
    // Contar total de artigos para paginação
    const total = await prisma.article.count({ where });
    
    return res.status(200).json({
      articles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return res.status(500).json({ 
      message: "Erro ao buscar artigos", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
} 