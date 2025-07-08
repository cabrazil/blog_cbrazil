export const aiPrompts = [
  {
    name: "Artigo de Inteligência Artificial",
    content: `Escreva um artigo informativo e envolvente sobre {topic} no campo da Inteligência Artificial. 
    O artigo deve ter uma introdução clara, desenvolvimento com exemplos práticos, e uma conclusão que resuma os principais pontos.
    Inclua uma breve explicação do conceito, suas aplicações atuais, desafios e tendências futuras.
    Use linguagem acessível para um público com conhecimento técnico intermediário.
    O artigo deve ter entre 800 e 1200 palavras.

    Instruções específicas:
    - Descrição: Deve ser uma frase curta e direta, com no máximo 100 caracteres
    - Conteúdo: Mantenha o desenvolvimento detalhado e completo`,
    isActive: true,
    metadata: {
      category: "Inteligência Artificial",
      targetAudience: "Desenvolvedores e entusiastas de tecnologia",
      tone: "Informativo e técnico"
    }
  },
  {
    name: "Artigo de Desenvolvimento Web",
    content: `Crie um artigo técnico e prático sobre {topic} no desenvolvimento web.
    O artigo deve incluir uma introdução ao conceito, exemplos de código quando relevante, boas práticas e dicas de implementação.
    Explique os benefícios, desafios comuns e soluções para problemas frequentes.
    Inclua referências a frameworks ou bibliotecas populares relacionadas ao tópico.
    O artigo deve ter entre 800 e 1200 palavras e ser adequado para desenvolvedores de nível intermediário.

    Instruções específicas:
    - Descrição: Deve ser uma frase curta e direta, com no máximo 100 caracteres
    - Conteúdo: Mantenha o desenvolvimento detalhado e completo`,
    isActive: true,
    metadata: {
      category: "Desenvolvimento Web",
      targetAudience: "Desenvolvedores web",
      tone: "Técnico e prático"
    }
  },
  {
    name: "Artigo de Ciência de Dados",
    content: `Elabore um artigo sobre {topic} na área de Ciência de Dados.
    O artigo deve explicar o conceito, sua importância no contexto atual, metodologias e ferramentas utilizadas.
    Inclua exemplos práticos de aplicação e casos de uso reais.
    Discuta os desafios comuns e as melhores práticas na área.
    O artigo deve ter entre 800 e 1200 palavras e ser adequado para profissionais de dados e analistas.

    Instruções específicas:
    - Descrição: Deve ser uma frase curta e direta, com no máximo 100 caracteres
    - Conteúdo: Mantenha o desenvolvimento detalhado e completo`,
    isActive: true,
    metadata: {
      category: "Ciência de Dados",
      targetAudience: "Cientistas de dados e analistas",
      tone: "Analítico e informativo"
    }
  },
  {
    name: "Artigo de Tecnologias Emergentes",
    content: `Escreva um artigo exploratório sobre {topic} como uma tecnologia emergente.
    O artigo deve apresentar uma visão geral do conceito, seu estado atual de desenvolvimento e potencial impacto futuro.
    Discuta aplicações práticas, desafios de implementação e tendências de mercado.
    Inclua exemplos de empresas ou projetos que estão utilizando essa tecnologia.
    O artigo deve ter entre 800 e 1200 palavras e ser acessível para um público com interesse em tecnologia.

    Instruções específicas:
    - Descrição: Deve ser uma frase curta e direta, com no máximo 100 caracteres
    - Conteúdo: Mantenha o desenvolvimento detalhado e completo`,
    isActive: true,
    metadata: {
      category: "Tecnologias Emergentes",
      targetAudience: "Profissionais de tecnologia e entusiastas",
      tone: "Exploratório e visionário"
    }
  },
  {
    name: "Artigo de Carreira em Tech",
    content: `Crie um artigo orientativo sobre {topic} para profissionais de tecnologia.
    O artigo deve oferecer conselhos práticos, dicas de desenvolvimento pessoal e profissional, e tendências do mercado.
    Inclua exemplos reais, estatísticas relevantes e recursos para aprofundamento no tema.
    Discuta desafios comuns e estratégias para superá-los.
    O artigo deve ter entre 800 e 1200 palavras e ser motivacional e informativo.`,
    isActive: true,
    metadata: {
      category: "Carreira em Tech",
      targetAudience: "Profissionais de tecnologia",
      tone: "Orientativo e motivacional"
    }
  },
    {
    name: "Prompt para Resumo de Artigo",
    content: `Crie um resumo conciso e informativo para o seguinte artigo sobre {topic}:
    
    {articleContent}
    
    O resumo deve ter entre 150 e 200 palavras, destacar os principais pontos e ser atraente para leitores interessados em {category}.`,
    isActive: true,
    metadata: {
      category: "Geral",
      targetAudience: "Editores e autores",
      tone: "Conciso e informativo"
    }
  },
  {
    name: "Prompt para Título de Artigo",
    content: `Gere 5 títulos criativos e atraentes para um artigo sobre {topic} na categoria {category}.
    Os títulos devem ser concisos, envolventes e otimizados para SEO.
    Inclua um mix de formatos: perguntas, declarações e títulos com números.`,
    isActive: true,
    metadata: {
      category: "Geral",
      targetAudience: "Editores e autores",
      tone: "Criativo e estratégico"
    }
  },
  {
    name: "Prompt para Palavras-chave",
    content: `Gere 10 palavras-chave relevantes para um artigo sobre {topic} na categoria {category}.
    As palavras-chave devem incluir termos de busca comuns, variações e termos relacionados.
    Considere a intenção de busca e o volume de pesquisas para cada termo.`,
    isActive: true,
    metadata: {
      category: "Geral",
      targetAudience: "Editores e autores",
      tone: "Estratégico"
    }
  }
]; 