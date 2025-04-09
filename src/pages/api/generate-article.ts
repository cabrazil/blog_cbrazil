import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { News } from "@/interfaces/news";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Aqui você pode integrar com a API de IA para gerar o conteúdo
    // Por enquanto, vamos usar dados mockados
    const newArticle: News = {
      id: Date.now(), // ID único baseado no timestamp
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(20),
      description: faker.lorem.paragraph(),
      date: new Date().toDateString(),
      datetime: new Date().toISOString(),
      category: {
        title: faker.helpers.arrayElement([
          "Tecnologia",
          "Desenvolvimento",
          "IA",
          "Cloud",
          "Segurança",
          "Blockchain",
        ]),
      },
      author: {
        name: faker.person.fullName(),
        role: faker.helpers.arrayElement([
          "Especialista em IA",
          "Desenvolvedor Full Stack",
          "Arquiteto de Software",
          "Especialista em Cloud",
          "Analista de Segurança",
        ]),
        imageUrl: faker.image.avatar(),
      },
      imageUrl: faker.image.urlLoremFlickr({ category: "technology" }),
    };

    return res.status(200).json(newArticle);
  } catch (error) {
    console.error('Erro ao gerar artigo:', error);
    return res.status(500).json({ message: 'Erro ao gerar artigo' });
  }
} 