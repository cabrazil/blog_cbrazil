import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default function AdminLogin() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Admin
        </Link>
        <span className="text-sm text-gray-600">
          Olá, {user.name || user.email}
        </span>
        <Link
          href="/api/auth/logout"
          className="text-sm text-red-600 hover:text-red-800"
        >
          Sair
        </Link>
      </div>
    )
  }

  return (
    <Link
      href="/api/auth/login"
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Área Restrita
    </Link>
  )
} 