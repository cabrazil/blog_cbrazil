import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const authorIdToUpdate = 1; // Assuming your author ID is 1
    const newImageUrl = 'https://avatars.githubusercontent.com/u/1273623?v=4';

    const updatedAuthor = await prisma.author.update({
      where: {
        id: authorIdToUpdate,
      },
      data: {
        imageUrl: newImageUrl,
      },
    });

    console.log(`Author with ID ${authorIdToUpdate} updated successfully:`, updatedAuthor);
  } catch (error) {
    console.error('Error updating author image:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
