import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

export async function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const session = await getSession(request, new NextResponse())
      
      // Se não houver sessão, redirecionar para o login
      if (!session) {
        const loginUrl = new URL('/api/auth/login', request.url)
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar se o usuário é o admin autorizado
      const user = session.user
      if (user?.email !== 'admin@cbrazil.com') {
        return new NextResponse('Acesso não autorizado', { status: 403 })
      }

      return NextResponse.next()
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return new NextResponse('Erro na autenticação', { status: 500 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 