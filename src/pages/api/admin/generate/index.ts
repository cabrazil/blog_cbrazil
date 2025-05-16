import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@auth0/nextjs-auth0/edge'
import OpenAI from 'openai'
import slugify from 'slugify'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Garantir que a resposta seja sempre JSON
  res.setHeader('Content-Type', 'application/json')

  try {
    const session = await getSession(req, res)

    if (!session?.user) {
      return res.status(401).json({ message: 'Não autorizado' })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido' })
    }

    const { promptId, categoryId, topic } = req.body

    if (!promptId || !categoryId || !topic) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    // Buscar o prompt selecionado
    const prompt = await prisma.aiPrompt.findUnique({
      where: { id: Number(promptId) },
    })

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt não encontrado' })
    }

    if (!prompt.isActive) {
      return res.status(400).json({ message: 'Prompt inativo' })
    }

    // Buscar a categoria selecionada
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    })

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }

    // Substituir {topic} pelo tópico real
    const promptContent = prompt.content.replace('{topic}', topic)

    // Gerar o artigo usando a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um escritor profissional de artigos de tecnologia. Seu objetivo é criar artigos informativos, bem estruturados e envolventes.',
        },
        {
          role: 'user',
          content: promptContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0].message.content

    if (!generatedContent) {
      throw new Error('Erro ao gerar conteúdo')
    }

    // Criar o artigo no banco de dados
    const article = await prisma.article.create({
      data: {
        title: topic,
        description: generatedContent.slice(0, 200) + '...',
        content: generatedContent,
        categoryId: Number(categoryId),
        authorId: session.user.sub, // Usando o sub do Auth0 como ID do autor
        published: false,
        imageUrl: '', // Campo obrigatório, será atualizado posteriormente
        slug: slugify(topic, { lower: true, strict: true }), // Gerar slug a partir do título
      },
    })

    // Registrar o log de geração
    await prisma.aiGenerationLog.create({
      data: {
        promptId: Number(promptId),
        articleId: article.id,
        success: true,
        tokensUsed: completion.usage?.total_tokens,
        duration: 0, // TODO: Implementar medição de duração
      },
    })

    return res.status(200).json(article)
  } catch (error) {
    console.error('Erro ao gerar artigo:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({ message: 'Erro de configuração da API OpenAI' })
      }
      if (error.message.includes('rate limit')) {
        return res.status(429).json({ message: 'Limite de requisições excedido' })
      }
      return res.status(500).json({ message: error.message })
    }
    
    return res.status(500).json({ message: 'Erro interno do servidor' })
  } finally {
    await prisma.$disconnect()
  }
} 