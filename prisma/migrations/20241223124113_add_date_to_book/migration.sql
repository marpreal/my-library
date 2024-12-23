/*
  Warnings:

  - You are about to drop the column `autor` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "autor",
DROP COLUMN "titulo",
ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'Unknown Author',
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled Book';
