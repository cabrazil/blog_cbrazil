export async function getRandomImage(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Erro ao buscar imagem no Unsplash:', response.statusText);
      return '/images/default-article.svg';
    }

    const data = await response.json();
    
    if (!data.results?.length) {
      console.warn('Nenhuma imagem encontrada para a query:', query);
      return '/images/default-article.svg';
    }

    const photo = data.results[0];
    // Usar a URL regular da imagem do Unsplash
    return photo.urls.regular;
  } catch (error) {
    console.error('Erro ao buscar imagem no Unsplash:', error);
    return '/images/default-article.svg';
  }
}