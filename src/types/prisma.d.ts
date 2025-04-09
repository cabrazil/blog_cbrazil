import { Prisma } from '@prisma/client';

declare module '@prisma/client' {
  interface AiPrompt {
    id: number;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    metadata: Prisma.JsonValue | null;
  }
} 