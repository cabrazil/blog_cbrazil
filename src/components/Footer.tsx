import Link from 'next/link'
import Image from 'next/image'
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaLinkedinIn, 
  FaTwitter 
} from 'react-icons/fa'
import { useState, useEffect } from "react";
import { Category } from "@prisma/client";

interface FooterProps {
  blogId?: number;
}

export default function Footer({ blogId = 1 }: FooterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?blogId=${blogId}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar categorias");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [blogId]);

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/cbrazil',
      icon: FaInstagram,
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@cbrazil',
      icon: FaTiktok,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@cbrazil',
      icon: FaYoutube,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/cbrazil',
      icon: FaLinkedinIn,
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/cbrazil',
      icon: FaTwitter,
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção Principal */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1">
            <Link href="/" className="block mb-4">
              <Image 
                src="/images/cbrazil_logo.png" 
                alt="cbrazil.com Logo" 
                width={180} 
                height={50} 
                className="hover:opacity-90"
              />
            </Link>
            <p className="text-gray-600 mb-6">
              Um laboratório prático sobre Inteligência Artificial, Engenharia de Prompts e o futuro da tecnologia.
            </p>
            {/* Redes Sociais */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-600 hover:text-gray-900">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Categorias
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Termos e Políticas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Termos e Políticas
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/termos-de-uso" className="text-gray-600 hover:text-gray-900">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade#cookies" className="text-gray-600 hover:text-gray-900">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-600 hover:text-gray-900">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 hover:text-gray-900">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} cbrazil.com. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 