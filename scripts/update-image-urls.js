const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função para gerar uma URL de imagem padrão
function getDefaultImageUrl() {
  return '/images/default-article.svg';
}

async function main() {
  console.log('Iniciando atualização de URLs de imagens...');

  try {
    // Buscar todos os artigos
    const articles = await prisma.article.findMany();
    console.log(`Encontrados ${articles.length} artigos para atualizar.`);

    // Atualizar cada artigo
    for (const article of articles) {
      console.log(`Atualizando artigo: ${article.title}`);
      
      // Verificar se a URL é do tipo source.unsplash.com
      if (article.imageUrl && article.imageUrl.includes('source.unsplash.com')) {
        console.log(`URL antiga: ${article.imageUrl}`);
        
        // Usar a imagem padrão
        const newImageUrl = getDefaultImageUrl();
        console.log(`Nova URL: ${newImageUrl}`);
        
        // Atualizar o artigo no banco de dados
        await prisma.article.update({
          where: { id: article.id },
          data: { imageUrl: newImageUrl },
        });
        
        console.log(`Artigo atualizado: ${article.title}`);
      } else {
        console.log(`Artigo ${article.title} não precisa de atualização.`);
      }
    }

    console.log('Atualização de URLs de imagens concluída.');
  } catch (error) {
    console.error('Erro ao atualizar URLs de imagens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 