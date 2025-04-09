/*
  Warnings:

  - The primary key for the `_ArticleToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ArticleToTag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");
