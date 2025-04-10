import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const articleId = parseInt(id);

  // GET - Buscar artigo
  if (req.method === "GET") {
    try {
      const article = await prisma.article.findUnique({
        where: {
          id: articleId,
        },
        include: {
          author: true,
          category: true,
        },
      });

      if (!article) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error("Erro ao buscar artigo:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  // PUT - Atualizar artigo
  else if (req.method === "PUT") {
    try {
      const { title, content, description, imageUrl, categoryId, published } = req.body;

      // Log para verificar o conteúdo recebido
      console.log('Conteúdo recebido na API:', content);

      // Verificar se o artigo existe
      const existingArticle = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!existingArticle) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }

      // Atualizar o artigo
      const updatedArticle = await prisma.article.update({
        where: { id: articleId },
        data: {
          title: title || existingArticle.title,
          content: content || existingArticle.content,
          description: description || existingArticle.description,
          imageUrl: imageUrl || existingArticle.imageUrl,
          categoryId: categoryId || existingArticle.categoryId,
          published: published !== undefined ? published : existingArticle.published,
          updatedAt: new Date(),
        },
        include: {
          author: true,
          category: true,
        },
      });

      // Log para verificar o conteúdo salvo
      console.log('Conteúdo salvo no banco:', updatedArticle.content);

      return res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Erro ao atualizar artigo:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  // Método não permitido
  else {
    return res.status(405).json({ message: "Método não permitido" });
  }
} 