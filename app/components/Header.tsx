import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
            <Image
              src="/images/cbrazil_logo.png"
              alt="CBrazil Blog Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-2xl font-bold">CBrazil Blog</span>
          </Link>
          
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/posts" className="hover:text-gray-300">
                Posts
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-300">
                Sobre
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
} 