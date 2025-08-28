import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Accordion, { AccordionItem } from '../components/Accordion';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer - CBrazil Blog</title>
        <meta name="description" content="Aviso Legal e informações importantes sobre o conteúdo do CBrazil Blog." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header blogId={1} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Aviso Legal (Disclaimer)</h1>
            
            <div className="article-content text-gray-800">
              <p className="mb-6">As informações contidas neste site (CBRAZIL.COM) são apenas para fins informativos. Embora nos esforcemos para manter as informações atualizadas e corretas, não garantimos a integridade, precisão ou confiabilidade do conteúdo. Qualquer confiança depositada nessas informações é estritamente por sua conta e risco.</p>

              <Accordion>
                <AccordionItem title="Responsabilidade pelo Conteúdo">
                  <p>O conteúdo deste blog reflete as opiniões pessoais do autor, baseadas em sua experiência e pesquisa. A tecnologia, especialmente a Inteligência Artificial, está em constante evolução. Portanto, o conteúdo pode não estar sempre atualizado com os desenvolvimentos mais recentes.</p>
                </AccordionItem>

                <AccordionItem title="Uso de Inteligência Artificial">
                  <p>Parte do conteúdo deste blog pode ser gerada ou assistida por ferramentas de Inteligência Artificial. Embora todos os esforços sejam feitos para revisar e garantir a precisão do conteúdo, podem ocorrer imprecisões. O objetivo é usar a IA como uma ferramenta para aprimorar e acelerar a criação de conteúdo, sempre com supervisão humana.</p>
                </AccordionItem>

                <AccordionItem title="Links Externos">
                  <p>Através deste site, você pode se conectar a outros sites que não estão sob o controle do CBRAZIL.COM. Não temos controle sobre a natureza, conteúdo e disponibilidade desses sites. A inclusão de quaisquer links não implica necessariamente uma recomendação ou endossa as visões expressas neles.</p>
                </AccordionItem>

                <AccordionItem title="Aconselhamento Profissional">
                  <p>Este blog não fornece aconselhamento profissional (seja de carreira, financeiro, legal ou outro). O conteúdo é puramente informativo. Você deve sempre procurar o conselho de um profissional qualificado para qualquer dúvida específica que possa ter.</p>
                </AccordionItem>

                <AccordionItem title="Limitação de Responsabilidade">
                  <p>Em nenhum caso seremos responsáveis por qualquer perda ou dano, incluindo, sem limitação, perdas ou danos indiretos ou consequenciais, ou qualquer perda ou dano decorrente da perda de dados ou lucros decorrentes de, ou em conexão com, o uso deste site.</p>
                </AccordionItem>
              </Accordion>

              <div className="text-center mt-10">
                <p className="text-sm text-gray-500">Ao usar este site, você concorda com este aviso legal.</p>
                <p className="text-sm text-gray-500">Última atualização: 9 de Julho de 2025</p>
              </div>
            </div>
          </div>
        </main>

        <Footer blogId={1} />
      </div>
    </>
  );
}
