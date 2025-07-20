-- AlterTable
ALTER TABLE "AiGenerationLog" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "AiPrompt" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "blogId" INTEGER;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "blogId" INTEGER;

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "themeSettings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_domain_key" ON "Blog"("domain");

-- CreateIndex
CREATE INDEX "AiGenerationLog_blogId_idx" ON "AiGenerationLog"("blogId");

-- CreateIndex
CREATE INDEX "AiPrompt_blogId_idx" ON "AiPrompt"("blogId");

-- CreateIndex
CREATE INDEX "Article_blogId_idx" ON "Article"("blogId");

-- CreateIndex
CREATE INDEX "Author_blogId_idx" ON "Author"("blogId");

-- CreateIndex
CREATE INDEX "Category_blogId_idx" ON "Category"("blogId");

-- CreateIndex
CREATE INDEX "Comment_blogId_idx" ON "Comment"("blogId");

-- CreateIndex
CREATE INDEX "Tag_blogId_idx" ON "Tag"("blogId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPrompt" ADD CONSTRAINT "AiPrompt_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGenerationLog" ADD CONSTRAINT "AiGenerationLog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

