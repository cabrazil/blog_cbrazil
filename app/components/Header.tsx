import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="py-8 border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
            <Image 
              src="/images/cbrazil_logo.png" 
              alt="cbrazil.com Logo" 
              width={220} 
              height={60} 
              className="mr-2"
              priority
            />
          </Link>
          
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Início
            </Link>
            <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
              Categorias
            </Link>
            <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-600 hover:text-gray-900">
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 