import { Category, Tag, Author } from '@prisma/client';

export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  content: string;
  createdAt: string; 
  updatedAt: string;
  published: boolean;
  viewCount: number;
  likeCount: number;
  author: Author;
  category: Category;
  tags: Tag[];
} 