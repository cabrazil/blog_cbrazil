import { concat, List, shuffle } from "lodash";

export const categories = [
  {
    category: "Inteligência Artificial",
    subcategories: [
      "Machine Learning",
      "Deep Learning",
      "Processamento de Linguagem Natural",
      "Visão Computacional",
      "Redes Neurais",
      "Aprendizado por Reforço",
      "Chatbots e Assistentes Virtuais",
      "IA Generativa",
      "Ética em IA",
      "Aplicações Práticas de IA"
    ],
  },
  {
    category: "Desenvolvimento Web",
    subcategories: [
      "Frontend",
      "Backend",
      "Full Stack",
      "Frameworks JavaScript",
      "APIs e Microsserviços",
      "Cloud Computing",
      "DevOps",
      "Segurança Web",
      "Performance e Otimização",
      "Acessibilidade Web"
    ],
  },
  {
    category: "Ciência de Dados",
    subcategories: [
      "Análise de Dados",
      "Visualização de Dados",
      "Big Data",
      "Data Mining",
      "Estatística",
      "Python para Ciência de Dados",
      "SQL e Bancos de Dados",
      "Data Engineering",
      "Data Governance",
      "Business Intelligence"
    ],
  },
  {
    category: "Tecnologias Emergentes",
    subcategories: [
      "Blockchain",
      "Internet das Coisas",
      "Realidade Virtual e Aumentada",
      "Computação Quântica",
      "5G e 6G",
      "Edge Computing",
      "Cidades Inteligentes",
      "Tecnologias Sustentáveis",
      "Biotecnologia",
      "Nanotecnologia"
    ],
  },
  {
    category: "Carreira em Tech",
    subcategories: [
      "Desenvolvimento de Carreira",
      "Habilidades Técnicas",
      "Soft Skills",
      "Entrevistas e Recrutamento",
      "Trabalho Remoto",
      "Diversidade e Inclusão",
      "Liderança Técnica",
      "Empreendedorismo",
      "Educação e Aprendizado Contínuo",
      "Tendências do Mercado"
    ],
  }
];

export function getRandomSubcategories() {
  let allSubcategories: any[] = [];
  categories.forEach(category => {
    allSubcategories = concat(allSubcategories, category.subcategories.map(subcategory => ({
      category: category.category,
      subcategory
    })));
  });

  const shuffledSubcategories = shuffle(allSubcategories);

  const selectedSubcategory = shuffledSubcategories[0];

  return {
    category: selectedSubcategory.category,
    subcategory: selectedSubcategory.subcategory
  };
}
