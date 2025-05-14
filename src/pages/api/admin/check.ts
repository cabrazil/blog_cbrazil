import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Verifica se a requisição tem o header x-admin-request
  const isAdminRequest = req.headers['x-admin-request'] === 'true';

  if (!isAdminRequest) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  // Aqui você pode adicionar mais verificações de autenticação se necessário
  // Por exemplo, verificar um token JWT, sessão, etc.

  return res.status(200).json({ message: 'Autorizado' });
} 