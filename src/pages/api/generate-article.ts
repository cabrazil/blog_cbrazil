import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { News } from "@/interfaces/news";
import { getRandomImage } from '@/config/unsplash';
import { slugify } from "@/utils/slugify";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funções auxiliares para gerar dados sem o Faker
function generateRandomTitle() {
  const titles = [
    "Inteligência Artificial: O Futuro da Tecnologia",
    "Machine Learning para Iniciantes",
    "Deep Learning: Uma Introdução",
    "Processamento de Linguagem Natural",
    "Visão Computacional: Ensinando Computadores a Ver",
    "Redes Neurais: Como Funcionam",
    "Chatbots e Assistentes Virtuais",
    "Ética na Inteligência Artificial",
    "Aplicações Práticas de IA",
    "O Impacto da IA na Sociedade"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateRandomParagraph() {
  const paragraphs = [
    "A Inteligência Artificial está transformando rapidamente o mundo em que vivemos. Desde assistentes virtuais até carros autônomos, a IA está se tornando uma parte essencial da nossa vida cotidiana.",
    "Machine Learning é uma subárea da Inteligência Artificial que permite que sistemas computacionais aprendam com dados sem serem explicitamente programados para realizar uma tarefa específica.",
    "Deep Learning é inspirado na estrutura e função do cérebro humano. Ele utiliza redes neurais artificiais com muitas camadas para aprender representações hierárquicas dos dados.",
    "O Processamento de Linguagem Natural permite que computadores entendam, interpretem e gerem linguagem humana de forma natural.",
    "A Visão Computacional é um campo da Inteligência Artificial que permite que computadores 'vejam' e interpretem o mundo visual.",
    "Redes Neurais são modelos computacionais inspirados no cérebro humano, compostos por camadas de neurônios artificiais que processam informações.",
    "Chatbots e assistentes virtuais estão se tornando cada vez mais sofisticados, capazes de entender e responder a perguntas complexas.",
    "A ética na Inteligência Artificial é um tema crucial, pois sistemas de IA podem refletir e até amplificar preconceitos presentes nos dados de treinamento.",
    "As aplicações práticas de IA são vastas, desde diagnóstico médico até otimização de processos industriais.",
    "O impacto da IA na sociedade é profundo, afetando desde o mercado de trabalho até a forma como interagimos com a tecnologia."
  ];
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function generateRandomParagraphs(count: number) {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += generateRandomParagraph() + "\n\n";
  }
  return result;
}

function getRandomCategory() {
  const categories = [
    "Tecnologia",
    "Desenvolvimento",
    "IA",
    "Cloud",
    "Segurança",
    "Blockchain",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomAuthorName() {
  const names = [
    "João Silva",
    "Maria Oliveira",
    "Carlos Santos",
    "Ana Pereira",
    "Pedro Costa",
    "Juliana Lima",
    "Ricardo Almeida",
    "Fernanda Souza",
    "Lucas Ferreira",
    "Patrícia Rodrigues"
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomAuthorRole() {
  const roles = [
    "Especialista em IA",
    "Desenvolvedor Full Stack",
    "Arquiteto de Software",
    "Especialista em Cloud",
    "Analista de Segurança",
  ];
  return roles[Math.floor(Math.random() * roles.length)];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Gerar dados sem usar o Faker
    const title = generateRandomTitle();
    const authorName = getRandomAuthorName();
    
    const newArticle: News = {
      id: Date.now(), // ID único baseado no timestamp
      title: title,
      slug: slugify(title),
      content: generateRandomParagraphs(10),
      description: generateRandomParagraph(),
      date: new Date().toDateString(),
      datetime: new Date().toISOString(),
      category: {
        title: getRandomCategory(),
      },
      author: {
        name: authorName,
        role: getRandomAuthorRole(),
        imageUrl: "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName) + "&background=0D8ABC&color=fff",
      },
      imageUrl: await getRandomImage(title),
    };

    return res.status(200).json(newArticle);
  } catch (error) {
    console.error('Erro ao gerar artigo:', error);
    return res.status(500).json({ message: 'Erro ao gerar artigo' });
  }
} 