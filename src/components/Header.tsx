import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

interface Category {
  id: string
  title: string
  slug: string
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories-with-articles')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Função para limpar o path
  const cleanPath = (path: string) => path.split('?')[0].replace(/\/$/, '') || '/';

  // Função para verificar se o link está ativo
  const isActive = (href: string) => {
    const current = cleanPath(router.asPath);
    const target = cleanPath(href);
    if (target === '/') {
      return current === '/';
    }
    return current === target || current.startsWith(target + '/');
  }

  // Log para depuração
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('router.asPath:', router.asPath)
  }

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
          <nav className="flex space-x-6 relative">
            <Link href="/" className={`text-gray-600 hover:text-gray-900 pb-1${isActive('/') ? ' border-b-2 border-blue-600' : ''}`}>
              Início
            </Link>
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              ref={dropdownRef}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                className={`text-gray-600 hover:text-gray-900 pb-1 flex items-center uppercase`}
                role="button"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                tabIndex={0}
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (typeof window !== 'undefined') {
                    // eslint-disable-next-line no-console
                    console.log('Clique no botão TEMAS!')
                  }
                  setDropdownOpen(v => !v);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(v => !v);
                  }
                }}
              >
                CATEGORIAS
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20 animate-fade-in pt-2" role="menu">
                  <ul className="py-2">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/categorias/${cat.slug}`}
                          className={`block px-6 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 transition-colors${router.asPath.startsWith(`/categorias/${cat.slug}`) ? ' border-b-2 border-blue-600' : ''}`}
                          role="menuitem"
                          tabIndex={0}
                        >
                          {cat.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link href="/sobre" className={`text-gray-600 hover:text-gray-900 pb-1${isActive('/sobre') ? ' border-b-2 border-blue-600' : ''}`}>
              Sobre
            </Link>
            <Link href="/contato" className={`text-gray-600 hover:text-gray-900 pb-1${isActive('/contato') ? ' border-b-2 border-blue-600' : ''}`}>
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 