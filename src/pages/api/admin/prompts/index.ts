import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verificar método HTTP
  if (req.method === "GET") {
    return handleGetPrompts(req, res);
  } else if (req.method === "POST") {
    return handleCreatePrompt(req, res);
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}

// Função para listar todos os prompts
async function handleGetPrompts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const skip = (page - 1) * limit;
    const isActive = req.query.active === '1' || req.query.active === 'true';

    const where = isActive ? { isActive: true } : {};

    const [prompts, total] = await Promise.all([
      prisma.aiPrompt.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.aiPrompt.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({ prompts, totalPages });
  } catch (error) {
    console.error("Erro ao buscar prompts:", error);
    return res.status(500).json({ 
      message: "Erro ao buscar prompts", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Função para criar um novo prompt
async function handleCreatePrompt(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, content, isActive = true, metadata = {} } = req.body;
    
    // Validar dados
    if (!name || !content) {
      return res.status(400).json({ message: "Nome e conteúdo são obrigatórios" });
    }
    
    // Criar prompt
    const prompt = await prisma.aiPrompt.create({
      data: {
        name,
        content,
        isActive,
        metadata,
        blogId: Number(process.env.BLOG_ID || process.env.NEXT_PUBLIC_BLOG_ID || 1), // Adicionado para multi-tenant
      }
    });
    
    return res.status(201).json(prompt);
  } catch (error) {
    console.error("Erro ao criar prompt:", error);
    return res.status(500).json({ 
      message: "Erro ao criar prompt", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
} 