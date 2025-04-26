import Link from 'next/link'
import Image from 'next/image'
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaLinkedinIn, 
  FaTwitter 
} from 'react-icons/fa'

export default function Footer() {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seção Principal */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
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
              Blog sobre Inteligência Artificial, Tecnologias emergentes 
              e Carreira em Tech.
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
                <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
                  Categorias
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

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              Receba as últimas novidades sobre IA direto no seu email.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Seu email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          </div> */}
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