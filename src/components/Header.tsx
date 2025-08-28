import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import SearchBar from './SearchBar' // Importa o SearchBar

interface Category {
  id: string
  title: string
  slug: string
}

interface HeaderProps {
  blogId?: number;
}

interface ThemeSettings {
  branding?: {
    logoLight?: string;
    logoDark?: string;
    siteTitle?: string;
    favicon?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export default function Header({ blogId = 1 }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null)
  const router = useRouter()

  // Configuração padrão de fallback
  const getDefaultConfig = (blogId: number) => {
    switch (blogId) {
      case 1:
        return {
          logo: '/images/cbrazil_logo.png',
          alt: 'cbrazil.com Logo',
          title: 'cbrazil.com'
        }
      case 2:
        return {
          logo: '/images/blog_casa_logo.png',
          alt: 'Blog da Casa Logo', 
          title: 'Blog da Casa'
        }
      default:
        return {
          logo: '/images/cbrazil_logo.png',
          alt: 'Logo',
          title: 'Blog'
        }
    }
  }

  // Configuração dinâmica baseada em themeSettings ou fallback
  const blogConfig = themeSettings?.branding ? {
    logo: themeSettings.branding.logoLight || getDefaultConfig(blogId).logo,
    alt: `${themeSettings.branding.siteTitle || getDefaultConfig(blogId).title} Logo`,
    title: themeSettings.branding.siteTitle || getDefaultConfig(blogId).title
  } : getDefaultConfig(blogId)

  useEffect(() => {
    // Buscar configurações do tema
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch(`/api/blog-settings?blogId=${blogId}`)
        if (response.ok) {
          const data = await response.json()
          setThemeSettings(data.themeSettings)
        }
      } catch (error) {
        console.error('Erro ao buscar configurações do tema:', error)
      }
    }

    // Buscar categorias
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories-with-articles?blogId=${blogId}`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    }

    fetchThemeSettings()
    fetchCategories()
  }, [blogId])

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  

  const cleanPath = (path: string) => path.split('?')[0].replace(/\/$/, '') || '/';
  const isActive = (href: string) => {
    const current = cleanPath(router.asPath);
    const target = cleanPath(href);
    if (target === '/') return current === '/';
    return current === target || current.startsWith(target + '/');
  }

  const navLinks = (
    <>
      <Link href="/" className={`block py-2 text-lg text-gray-600 hover:text-gray-900${isActive('/') ? ' font-bold text-blue-600' : ''}`}>
        Início
      </Link>
      
      {/* Categorias no mobile */}
      <div className="py-2">
        <div className="text-lg font-semibold text-gray-800 mb-2">CATEGORIAS</div>
        <div className="ml-4 space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="block py-1 text-base text-gray-600 hover:text-gray-900"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/sobre" className={`block py-2 text-lg text-gray-600 hover:text-gray-900${isActive('/sobre') ? ' font-bold text-blue-600' : ''}`}>
        Sobre
      </Link>
      <Link href="/contato" className={`block py-2 text-lg text-gray-600 hover:text-gray-900${isActive('/contato') ? ' font-bold text-blue-600' : ''}`}>
        Contato
      </Link>
      <Link href="/api/auth/login?returnTo=/admin" className={`block py-2 text-lg text-gray-600 hover:text-gray-900${isActive('/admin') ? ' font-bold text-blue-600' : ''}`}>
        Área Restrita
      </Link>
    </>
  );

  return (
    <header className="py-4 md:py-6 border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-[220px] h-[65px] md:w-[280px] md:h-[80px]">
              <Image 
                src={blogConfig.logo} 
                alt={blogConfig.alt} 
                fill
                style={{ objectFit: 'contain' }}
                priority
                sizes="(max-width: 768px) 220px, 280px"
              />
            </div>
          </Link>

          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center flex-grow justify-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className={`block md:inline-block py-2 md:py-0 text-lg text-gray-600 hover:text-gray-900${isActive('/') ? ' font-bold text-blue-600' : ''}`}>
                Início
              </Link>
              
              {/* Dropdown Categorias */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 py-2 md:py-0 text-lg text-gray-600 hover:text-gray-900"
                >
                  <span>CATEGORIAS</span>
                  <svg className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/sobre" className={`block md:inline-block py-2 md:py-0 text-lg text-gray-600 hover:text-gray-900${isActive('/sobre') ? ' font-bold text-blue-600' : ''}`}>
                Sobre
              </Link>
              <Link href="/contato" className={`block md:inline-block py-2 md:py-0 text-lg text-gray-600 hover:text-gray-900${isActive('/contato') ? ' font-bold text-blue-600' : ''}`}>
                Contato
              </Link>
              <Link href="/api/auth/login?returnTo=/admin" className={`block md:inline-block py-2 md:py-0 text-lg text-gray-600 hover:text-gray-900${isActive('/admin') ? ' font-bold text-blue-600' : ''}`}>
                Área Restrita
              </Link>
            </div>
          </nav>

          {/* Barra de Busca e Botão de Menu */}
          <div className="flex items-center">
            <div className="hidden md:block ml-6">
              <SearchBar />
            </div>

            <div className="md:hidden ml-4">
              <button 
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-4 pt-4 pb-3">
            <SearchBar />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  )
} 