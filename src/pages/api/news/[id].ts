import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

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

      // Prevenir o cache da resposta
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

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
      const { title, description, content, imageUrl, categoryId, published } = req.body;

      console.log('Dados recebidos:', { title, description, content, imageUrl, categoryId, published });

      // Validação dos campos obrigatórios
      if (!title || !description || !content) {
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
      }

      // Verificar se o artigo existe
      const existingArticle = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!existingArticle) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }

      // Limpar o conteúdo HTML para prevenir XSS
      const cleanContent = purify.sanitize(content);

      // Atualizar o artigo
      const updatedArticle = await prisma.article.update({
        where: { id: articleId },
        data: {
          title,
          description,
          content: cleanContent, // Usar o conteúdo limpo
          imageUrl,
          categoryId,
          published: published || false,
          updatedAt: new Date(),
        },
        include: {
          author: true,
          category: true,
        },
      });

      console.log('Artigo atualizado:', updatedArticle);

      return res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Erro ao atualizar artigo:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    } finally {
      await prisma.$disconnect();
    }
  }

  // DELETE - Excluir artigo
  else if (req.method === "DELETE") {
    try {
      // Verificar se o artigo existe
      const existingArticle = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!existingArticle) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }

      // Excluir o artigo
      await prisma.article.delete({
        where: { id: articleId },
      });

      return res.status(204).send(null); // 204 No Content é uma resposta comum para DELETE bem-sucedido
    } catch (error) {
      console.error("Erro ao excluir artigo:", error);
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