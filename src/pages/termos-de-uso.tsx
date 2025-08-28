import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermosDeUso() {
  return (
    <>
      <Head>
        <title>Termos de Uso - CBrazil Blog</title>
        <meta name="description" content="Termos e condições de uso do CBrazil Blog." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header blogId={1} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
            
            <div className="article-content text-gray-800">
              <p>Bem-vindo ao CBRAZIL.COM! Ao acessar ou usar nosso site, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso e Condições.</p>
              <p>Caso não concorde com qualquer parte deste acordo, solicitamos que não utilize o site.</p>

              <h2>1. Aceitação dos Termos</h2>
              <p>1.1. O uso do site CBRAZIL.COM está sujeito a estes Termos de Uso, que podem ser atualizados periodicamente sem aviso prévio. Você deve revisar regularmente esta página para estar ciente das alterações.</p>

              <h2>2. Descrição do Serviço</h2>
              <p>2.1. O CBRAZIL.COM é um site de notícias voltado para o segmento de tecnologia, oferecendo conteúdo informativo, artigos, análises e atualizações sobre as últimas tendências tecnológicas.</p>
              <p>2.2. O site fornece conteúdo de maneira gratuita, com exceção de áreas que podem ser acessadas mediante pagamento, como conteúdos premium ou serviços adicionais.</p>

              <h2>3. Uso do Site</h2>
              <p>3.1. Você se compromete a utilizar o site de acordo com a legislação vigente, de maneira ética, respeitosa e sem prejudicar o funcionamento do site ou a experiência de outros usuários.</p>
              <p>3.2. Você é responsável por manter a confidencialidade de sua conta (caso crie uma) e pela segurança de sua senha, sendo responsável por todas as atividades realizadas em sua conta.</p>

              <h2>4. Propriedade Intelectual</h2>
              <p>4.1. Todo o conteúdo disponível no CBRAZIL.COM, incluindo, mas não se limitando a, textos, imagens, gráficos, logotipos, vídeos, e marcas registradas, são de propriedade do CBRAZIL.COM ou de seus licenciadores e são protegidos por leis de direitos autorais e propriedade intelectual.</p>
              <p>4.2. Você não pode copiar, reproduzir, distribuir ou criar trabalhos derivados de qualquer conteúdo do site sem a devida permissão expressa do CBRAZIL.COM.</p>

              <h2>5. Responsabilidade do Usuário</h2>
              <p>5.1. O usuário se compromete a não usar o site para fins ilícitos ou proibidos, incluindo, mas não se limitando a, violação de direitos de propriedade intelectual, difamação, disseminação de vírus ou outros conteúdos prejudiciais.</p>
              <p>5.2. O CBRAZIL.COM não se responsabiliza por danos diretos, indiretos, incidentais, consequenciais ou punitivos que possam resultar do uso ou da incapacidade de uso do site.</p>

              <h2>6. Links para Terceiros</h2>
              <p>6.1. O CBRAZIL.COM pode conter links para sites de terceiros. Esses links são fornecidos para conveniência dos usuários e não implicam endosso ou responsabilidade por parte do CBRAZIL.COM.</p>
              <p>6.2. Ao acessar links para sites de terceiros, você está sujeito às políticas e termos de uso desses sites.</p>

              <h2>7. Privacidade e Proteção de Dados</h2>
              <p>7.1. A sua privacidade é importante para nós. Consulte nossa Política de Privacidade para obter informações sobre como coletamos, usamos e protegemos seus dados pessoais.</p>
              <p>7.2. Ao utilizar nosso site, você consente com o uso das informações conforme descrito em nossa Política de Privacidade.</p>

              <h2>8. Modificações no Site</h2>
              <p>8.1. O CBRAZIL.COM reserva-se o direito de modificar ou descontinuar, temporária ou permanentemente, qualquer parte do site, com ou sem aviso prévio, e não será responsável por quaisquer danos decorrentes dessas modificações.</p>

              <h2>9. Limitação de Responsabilidade</h2>
              <p>9.1. O CBRAZIL.COM se esforça para fornecer informações precisas e atualizadas, mas não garante que todo o conteúdo seja isento de erros ou omissões.</p>
              <p>9.2. O CBRAZIL.COM não será responsável por qualquer tipo de dano que possa surgir devido ao uso indevido ou interpretação incorreta das informações contidas no site.</p>

              <h2>10. Conteúdo Gerado por Usuários</h2>
              <p>10.1. Os usuários podem interagir com o conteúdo do site, incluindo a postagem de comentários, artigos e outros conteúdos. O CBRAZIL.COM reserva-se o direito de moderar, editar ou remover qualquer conteúdo considerado inadequado, ofensivo ou em desacordo com estes Termos de Uso.</p>
              <p>10.2. O usuário concede ao CBRAZIL.COM uma licença irrevogável, não exclusiva e sem royalties para utilizar, exibir e modificar qualquer conteúdo gerado por ele, conforme necessário, para fins de operação do site.</p>

              <h2>11. Foro e Legislação Aplicável</h2>
              <p>11.1. Estes Termos de Uso serão regidos e interpretados de acordo com as leis brasileiras.</p>

              <h2>12. Disposições Finais</h2>
              <p>12.1. Se qualquer disposição destes Termos de Uso for considerada inválida ou inexequível, as disposições remanescentes permanecerão em pleno vigor e efeito.</p>
              <p>12.2. O CBRAZIL.COM pode, a seu exclusivo critério, modificar estes Termos de Uso a qualquer momento. A continuação do uso do site após tais modificações implicará na aceitação dos novos termos.</p>

              <h2>13. Contato</h2>
              <p>Se tiver dúvidas ou precisar de mais informações, entre em contato conosco pelo e-mail: contato@cbrazil.com.</p>
              
              <p className="text-sm text-gray-500 mt-10">Esses Termos de Uso e Condições foram elaborados para proteger tanto o CBRAZIL.COM quanto seus usuários, garantindo uma navegação segura e legal dentro do site.</p>
              <p className="text-sm text-gray-500">Última atualização: 31 de dezembro de 2024</p>
            </div>
          </div>
        </main>

        <Footer blogId={1} />
      </div>
    </>
  );
}
