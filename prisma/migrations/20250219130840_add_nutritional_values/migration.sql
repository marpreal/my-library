-- CreateTable
CREATE TABLE "NutritionalValue" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionalValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NutritionalValue" ADD CONSTRAINT "NutritionalValue_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
