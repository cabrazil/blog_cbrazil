import { Author } from './author';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  articleId: number;
} 