export interface News {
  id: number;
  title: string;
  content: string;
  description: string;
  date: string;
  datetime: string;
  slug: string;
  category: {
    title: string;
  };
  author: {
    name: string;
    role: string;
    imageUrl: string;
  };
  imageUrl: string;
} 