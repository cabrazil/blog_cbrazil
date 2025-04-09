import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API OpenAI recebeu uma requisição:", {
    method: req.method,
    body: req.body,
    query: req.query,
    headers: req.headers,
  });

  // Verificar se o método é POST ou GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    console.log("Método não permitido:", req.method);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Para GET, usar query params, para POST, usar body
  const text = req.method === 'POST' ? req.body.text : req.query.text as string;
  console.log("Texto recebido:", text);

  // Verificar se o texto foi fornecido
  if (!text) {
    console.log("Texto não fornecido");
    return res.status(400).json({ 
      error: 'Por favor, forneça um texto',
      exemplo: 'Para GET: /api/openAIRequests?text=Olá, como vai?',
      exemploPost: 'Para POST: { "text": "Olá, como vai?" }'
    });
  }

  try {
    console.log("Chamando a API OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Corrigido o nome do modelo
      messages: [{ role: "system", content: text }],
    });
    console.log("Resposta da API OpenAI recebida");

    return res.status(200).json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erro na API OpenAI:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar a requisição',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
