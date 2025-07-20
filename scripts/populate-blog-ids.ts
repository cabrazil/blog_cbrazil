
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de migração de dados para multi-tenant...');

  // 1. Criar o blog principal se ele não existir
  let blog = await prisma.blog.findUnique({
    where: { slug: 'principal' },
  });

  if (!blog) {
    console.log('Nenhum blog principal encontrado. Criando um novo...');
    blog = await prisma.blog.create({
      data: {
        name: 'Blog Principal',
        slug: 'principal',
      },
    });
    console.log(`Blog principal criado com sucesso! ID: ${blog.id}`);
  } else {
    console.log(`Blog principal já existe. ID: ${blog.id}`);
  }

  const blogId = blog.id;

  // 2. Usar uma transação para atualizar todos os modelos
  console.log('Iniciando a atualização dos registros existentes...');

  try {
    const [
      articleCount,
      authorCount,
      categoryCount,
      tagCount,
      commentCount,
      aiPromptCount,
      aiLogCount,
    ] = await prisma.$transaction([
      prisma.article.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.author.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.category.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.tag.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.comment.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.aiPrompt.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
      prisma.aiGenerationLog.updateMany({
        where: { blogId: null },
        data: { blogId: blogId },
      }),
    ]);

    console.log('--- Resultados da Atualização ---');
    console.log(`${articleCount.count} artigos atualizados.`);
    console.log(`${authorCount.count} autores atualizados.`);
    console.log(`${categoryCount.count} categorias atualizadas.`);
    console.log(`${tagCount.count} tags atualizadas.`);
    console.log(`${commentCount.count} comentários atualizados.`);
    console.log(`${aiPromptCount.count} prompts de IA atualizados.`);
    console.log(`${aiLogCount.count} logs de geração de IA atualizados.`);
    console.log('---------------------------------');
    console.log('Todos os registros foram associados ao blog principal com sucesso!');

  } catch (error) {
    console.error('Ocorreu um erro durante a transação. Nenhuma alteração foi feita.');
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Erro ao executar o script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
