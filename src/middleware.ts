import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return new NextResponse('Autenticação necessária', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Área Administrativa"',
        },
      })
    }

    // Decodificar as credenciais
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Verificar as credenciais
    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (username !== validUsername || password !== validPassword) {
      return new NextResponse('Credenciais inválidas', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Área Administrativa"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 