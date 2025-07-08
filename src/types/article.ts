export interface Article {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
  aiKeywords: string[];
  aiPrompt: string;
  published: boolean;
  category: { title: string };
} 