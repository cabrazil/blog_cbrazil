import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  // Validar ID
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  const promptId = parseInt(id);
  
  if (isNaN(promptId)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  
  // Verificar método HTTP
  if (req.method === "GET") {
    return handleGetPrompt(promptId, res);
  } else if (req.method === "PUT") {
    return handleUpdatePrompt(promptId, req, res);
  } else if (req.method === "DELETE") {
    return handleDeletePrompt(promptId, res);
  } else {
    return res.status(405).json({ message: "Método não permitido" });
  }
}

// Função para obter um prompt específico
async function handleGetPrompt(id: number, res: NextApiResponse) {
  try {
    const prompt = await prisma.aiPrompt.findUnique({
      where: { id }
    });
    
    if (!prompt) {
      return res.status(404).json({ message: "Prompt não encontrado" });
    }
    
    return res.status(200).json(prompt);
  } catch (error) {
    console.error("Erro ao buscar prompt:", error);
    return res.status(500).json({ 
      message: "Erro ao buscar prompt", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Função para atualizar um prompt
async function handleUpdatePrompt(id: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, content, isActive, metadata } = req.body;
    
    // Verificar se o prompt existe
    const existingPrompt = await prisma.aiPrompt.findUnique({
      where: { id }
    });
    
    if (!existingPrompt) {
      return res.status(404).json({ message: "Prompt não encontrado" });
    }
    
    // Atualizar prompt
    const updatedPrompt = await prisma.aiPrompt.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingPrompt.name,
        content: content !== undefined ? content : existingPrompt.content,
        isActive: isActive !== undefined ? isActive : existingPrompt.isActive,
        metadata: metadata !== undefined ? metadata : existingPrompt.metadata
      }
    });
    
    return res.status(200).json(updatedPrompt);
  } catch (error) {
    console.error("Erro ao atualizar prompt:", error);
    return res.status(500).json({ 
      message: "Erro ao atualizar prompt", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Função para excluir um prompt
async function handleDeletePrompt(id: number, res: NextApiResponse) {
  try {
    // Verificar se o prompt existe
    const existingPrompt = await prisma.aiPrompt.findUnique({
      where: { id }
    });
    
    if (!existingPrompt) {
      return res.status(404).json({ message: "Prompt não encontrado" });
    }
    
    // Excluir prompt
    await prisma.aiPrompt.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: "Prompt excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir prompt:", error);
    return res.status(500).json({ 
      message: "Erro ao excluir prompt", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
} 