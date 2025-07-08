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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories-with-articles')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoryDropdownOpen])

  const cleanPath = (path: string) => path.split('?')[0].replace(/\/$/, '') || '/';
  const isActive = (href: string) => {
    const current = cleanPath(router.asPath);
    const target = cleanPath(href);
    if (target === '/') return current === '/';
    return current === target || current.startsWith(target + '/');
  }

  const navLinks = (
    <>
      <Link href="/" className={`block md:inline-block py-2 md:py-0 text-gray-600 hover:text-gray-900${isActive('/') ? ' font-bold text-blue-600' : ''}`}>
        Início
      </Link>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setCategoryDropdownOpen(v => !v)}
          className={`w-full text-left md:text-center py-2 md:py-0 text-gray-600 hover:text-gray-900 flex justify-between items-center md:inline-flex${isActive('/categories') ? ' font-bold text-blue-600' : ''}`}
        >
          Categorias
          <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        
        {isCategoryDropdownOpen && (
          <div className="md:absolute md:left-0 mt-2 w-full md:w-64 rounded-md md:shadow-lg bg-white md:border md:border-gray-200 z-20">
            <div className="pl-4 md:pl-0 py-2 space-y-2 md:space-y-0">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`block text-gray-500 hover:text-blue-700 md:px-4 md:py-2 md:hover:bg-gray-100${router.asPath.startsWith(`/categories/${cat.slug}`) ? ' font-semibold text-blue-600' : ''}`}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link href="/sobre" className={`block md:inline-block py-2 md:py-0 text-gray-600 hover:text-gray-900${isActive('/sobre') ? ' font-bold text-blue-600' : ''}`}>
        Sobre
      </Link>
      <Link href="/contato" className={`block md:inline-block py-2 md:py-0 text-gray-600 hover:text-gray-900${isActive('/contato') ? ' font-bold text-blue-600' : ''}`}>
        Contato
      </Link>
      <Link href="/api/auth/login?returnTo=/admin" className={`block md:inline-block py-2 md:py-0 text-gray-600 hover:text-gray-900${isActive('/admin') ? ' font-bold text-blue-600' : ''}`}>
        Área Restrita
      </Link>
    </>
  );

  return (
    <header className="py-4 md:py-6 border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-[180px] h-[50px] md:w-[220px] md:h-[60px]">
              <Image 
                src="/images/cbrazil_logo.png" 
                alt="cbrazil.com Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
                sizes="(max-width: 768px) 180px, 220px"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks}
          </div>

          <div className="md:hidden">
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

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  )
} 