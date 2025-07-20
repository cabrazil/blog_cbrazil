const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const blogIdToUpdate = parseInt(args[0], 10); // Pega o primeiro argumento da linha de comando

  if (isNaN(blogIdToUpdate)) {
    console.error('Uso: npx ts-node scripts/update-blog-settings.ts <blogId>');
    process.exit(1);
  }

  const themeSettings = {
    "branding": {
      "logoLight": "/images/cbrazil_logo.png",
      "logoDark": "/images/cbrazil_logo_dark.png",
      "favicon": "/favicon.ico",
      "siteTitle": "cbrazil.com"
    },
    "colors": {
      "primary": "#2563eb",
      "secondary": "#10b981",
      "background": "#f9fafb",
      "textPrimary": "#1f2937",
      "textSecondary": "#4b5563",
      "accent": "#ef4444"
    },
    "fonts": {
      "bodyFont": "Inter, sans-serif",
      "headingFont": "Montserrat, sans-serif"
    },
    "layout": {
      "headerStyle": "default",
      "footerColumns": 4,
      "articleCardStyle": "default",
      "sidebarEnabled": false,
      "sidebarPosition": "right"
    },
    "seo": {
      "defaultMetaDescription": "Blog sobre Inteligência Artificial, Processamento de Linguagem Natural e Machine Learning para todos",
      "defaultKeywords": ["IA", "Inteligência Artificial", "Machine Learning", "NLP", "Tecnologia"],
      "socialImage": "/images/social-share.png"
    },
    "socialLinks": {
      "twitter": "https://twitter.com/cbrazil",
      "linkedin": "https://linkedin.com/in/cbrazil",
      "github": "https://github.com/cbrazil"
    },
    "footer": {
      "description": "Seu portal de conhecimento em Inteligência Artificial e tecnologia.",
      "copyrightText": "© 2025 cbrazil.com. Todos os direitos reservados."
    },
    "customCode": {
      "css": "",
      "js": ""
    }
  };

  try {
    const updatedBlog = await prisma.blog.update({
      where: { id: blogIdToUpdate },
      data: {
        themeSettings: themeSettings,
      },
    });
    console.log(`Blog com ID ${blogIdToUpdate} atualizado com sucesso!`);
    console.log(updatedBlog);
  } catch (error) {
    console.error(`Erro ao atualizar o blog com ID ${blogIdToUpdate}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

main();