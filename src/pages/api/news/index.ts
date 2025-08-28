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
    // Verificar se é uma requisição do painel de administração
    const isAdmin = req.headers["x-admin-request"] === "true";
    
    // Obter parâmetros de paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;
    
    // Verificar se é para excluir artigos da home
    const excludeHomeArticles = req.query.excludeHome === "true";
    
    // Buscar artigos com paginação
    const blogId = Number(process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          blogId: blogId,
          // Se não for admin, mostrar apenas artigos publicados
          ...(isAdmin ? {} : { published: true }),
          // Se for para excluir artigos da home, excluir os 6 mais recentes
          ...(excludeHomeArticles ? {
            NOT: {
              id: {
                in: await prisma.article.findMany({
                  where: { published: true, blogId: blogId },
                  orderBy: { createdAt: 'desc' },
                  take: 6,
                  select: { id: true }
                }).then(articles => articles.map(a => a.id))
              }
            }
          } : {})
        },
        include: {
          author: true,
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          blogId: blogId,
          ...(isAdmin ? {} : { published: true }),
          ...(excludeHomeArticles ? {
            NOT: {
              id: {
                in: await prisma.article.findMany({
                  where: { published: true, blogId: blogId },
                  orderBy: { createdAt: 'desc' },
                  take: 6,
                  select: { id: true }
                }).then(articles => articles.map(a => a.id))
              }
            }
          } : {})
        },
      }),
    ]);

    return res.status(200).json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    await prisma.$disconnect();
  }
} 