import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Consultando tabelas do banco...");
    
    // Consulta para listar todas as tabelas do schema public
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log("Tabelas encontradas:", tables);
    
    return res.status(200).json({ tables });
  } catch (error) {
    console.error("Erro ao listar tabelas:", error);
    return res.status(500).json({ 
      message: "Erro ao listar tabelas", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  } finally {
    await prisma.$disconnect();
  }
} 