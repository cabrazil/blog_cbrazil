import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre - CBrazil Blog</title>
        <meta name="description" content="Conheça mais sobre o CBrazil Blog e sua missão" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="py-8 border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/">
                  <Image 
                    src="/images/cbrazil_logo.png" 
                    alt="cbrazil.com Logo" 
                    width={220} 
                    height={60} 
                    className="mr-2"
                    priority
                  />
                </Link>
              </div>
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
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section com Foto */}
        <div className="flex justify-center items-center py-12">
          <div className="relative w-[800px] h-[400px]">
            <Image
              src="/images/profile.jpeg"
              alt="Carlos Brazil na praia"
              fill
              className="object-cover object-center rounded-lg shadow-xl"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/70 rounded-b-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Carlos Brazil</h1>
                <p className="text-xl md:text-2xl">Desenvolvedor Full Stack & Entusiasta de IA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de 3 Colunas */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {/* Coluna QUEM */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">QUEM SOU</h2>
              <p className="text-gray-600 text-center">
              Olá, sou Carlos Brazil, um profissional de Tecnologia da Informação com mais de 35 anos de experiência, 
              e um entusiasta da Inteligência Artificial.<br />
              Já sou 60+, casado com a Cris, e sou orgulhoso pai do Vinicius, da Vanessa e do Rodolpho.<br />
              Minha carreira que iniciou como programador, me levou depois para atuar como gestor de TI e Projetos
              como implantações de ERP, integração de sistemas corporativos, desenvolvimento de software e segurança da informação.<br />
              Sou graduado em Tecnologia em Processamento de Dados pelo Mackenzie, possuo MBA em Gestão de Projetos pela FIAP 
              e complementei minha formação com um Bootcamp FullStack pela Rocketseat.
              </p>
            </div>

            {/* Coluna POR QUE */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">POR QUE</h2>
              <p className="text-gray-600 text-center">
              Agora, com mais tempo disponível, estou me dedicando a projetos que sempre sonhei em realizar, explorando novas áreas 
              como a Inteligência Artificial, que me fascina por seu potencial transformador.<br />
              A IA é uma tecnologia que está mudando o mundo e eu quero contribuir para essa transformação.<br />
              Quero explorar as aplicações práticas da IA, discutir as tendências mais recentes e desmistificar 
              conceitos complexos, tornando-os acessíveis a todos.<br />
              Sou um eterno aprendiz, curioso por natureza e acredito no poder da tecnologia para construir um futuro melhor.
              </p>
            </div>

            {/* Coluna ONDE */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">ONDE</h2>
              <p className="text-gray-600 text-center">
              Aproveitando a flexibilidade do trabalho remoto, divido meu tempo entre Guarulhos e Ubatuba. 
              Essa escolha me permite desfrutar de maior tranquilidade e me conectar com a natureza, o que considero 
              essencial para a criatividade e o bem-estar.<br />
              Você pode me encontrar no LinkedIn <span className="text-blue-500 hover:underline">linkedin.com/in/carlos-brazil-75a98913 </span> 
              ou entrar em contato por e-mail <span className="text-blue-500 hover:underline">contato@cbrazil.com</span><br />
              Fique à vontade para comentar nos artigos, enviar mensagens e participar do Blog! 
              Adoro trocar ideias e aprender com vocês.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12 mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">cbrazil.com</h2>
                <p className="text-gray-600 mt-1">IA para Todos</p>
              </div>
              <div className="flex space-x-6">
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
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} cbrazil.com. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 