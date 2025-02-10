/*
  Warnings:

  - Made the column `userId` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `MovieReview` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `TBRBook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MovieReview" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TBRBook" ALTER COLUMN "userId" SET NOT NULL;
