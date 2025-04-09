export interface NewsProps {
  length: number;
  title: string;
  category: string;
  preview: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  userId?: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  description: string;
  date: string;
  datetime: string;
  category: Category;
  author: Author;
  imageUrl: string;
  comments?: Comment[];
}

interface Author {
  name: string;
  role: string;
  imageUrl: string;
}

interface Category {
  title: string;
  category?: string;
}
