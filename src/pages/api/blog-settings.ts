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
    // Obter blogId da query string com fallback
    const blogId = Number(req.query.blogId || process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1);

    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        themeSettings: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog não encontrado" });
    }

    return res.status(200).json({
      id: blog.id,
      name: blog.name,
      slug: blog.slug,
      themeSettings: blog.themeSettings,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações do blog:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    await prisma.$disconnect();
  }
} 