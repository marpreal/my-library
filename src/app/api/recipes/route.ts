import { NutritionalValue, PrismaClient, Recipe } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
type RecipeWithRatings = Recipe & {
  ratings: { value: number }[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const category = searchParams.get("category") || undefined;
    const id = searchParams.get("id");
    const publicOnly = searchParams.get("publicOnly") === "true";

    if (id) {
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: Number(id),
          OR: [{ isPublic: true }, userId ? { userId } : {}],
        },
        include: {
          nutritionalValues: true,
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
          ratings: true,
        },
      });

      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found or unauthorized" },
          { status: 404 }
        );
      }

      const averageRating =
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((acc, r) => acc + r.value, 0) /
            recipe.ratings.length
          : 0;

      return NextResponse.json({ ...recipe, averageRating }, { status: 200 });
    }

    let recipes: RecipeWithRatings[] = [];

    if (publicOnly) {
      recipes = await prisma.recipe.findMany({
        where: {
          isPublic: true,
          category,
          NOT: userId ? { userId } : undefined,
        },
        orderBy: { createdAt: "desc" },
        include: {
          nutritionalValues: true,
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
          user: { select: { name: true, image: true } },
          ratings: true,
        },
      });
    } else if (userId) {
      recipes = await prisma.recipe.findMany({
        where: { userId, category },
        orderBy: { createdAt: "desc" },
        include: {
          nutritionalValues: true,
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
          ratings: true,
        },
      });
    }

    const recipesWithRatings = recipes.map((recipe) => ({
      ...recipe,
      averageRating:
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((acc, r) => acc + r.value, 0) /
            recipe.ratings.length
          : 0,
    }));

    return NextResponse.json(recipesWithRatings, { status: 200 });
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      category,
      description,
      ingredients,
      nutritionalValues,
      userId,
      isPublic,
      imageUrl,
    }: {
      title: string;
      category: string;
      description: string;
      ingredients: string[];
      nutritionalValues?: Omit<
        NutritionalValue,
        "id" | "recipeId" | "createdAt"
      >[];
      userId: string;
      isPublic: boolean;
      imageUrl?: string;
    } = await request.json();

    if (!title || !category || !ingredients.length) {
      return NextResponse.json(
        { error: "Title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        category,
        description,
        ingredients,
        userId,
        isPublic,
        imageUrl,
        nutritionalValues: {
          create:
            nutritionalValues?.map((value) => ({
              calories: value.calories ?? 0,
              protein: value.protein ?? 0,
              carbs: value.carbs ?? 0,
              fats: value.fats ?? 0,
              fiber: value.fiber ?? null,
              sugar: value.sugar ?? null,
              sodium: value.sodium ?? null,
            })) || [],
        },
        ratings: isPublic ? { create: [] } : undefined,
      },
      include: {
        nutritionalValues: true,
        ratings: true,
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("POST /api/recipes error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      title,
      category,
      description,
      ingredients,
      userId,
      nutritionalValues,
      isPublic,
      imageUrl,
    } = await request.json();

    if (!id || !title || !category || !ingredients.length) {
      return NextResponse.json(
        { error: "ID, title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const existingRecipe = await prisma.recipe.findFirst({
      where: { id: Number(id), userId },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }
    const cleanedNutritionalValues = Array.isArray(nutritionalValues)
      ? nutritionalValues
      : [nutritionalValues];

    for (const value of cleanedNutritionalValues) {
      const existingValue = await prisma.nutritionalValue.findFirst({
        where: { recipeId: Number(id) },
      });

      if (existingValue) {
        await prisma.nutritionalValue.update({
          where: { id: existingValue.id },
          data: {
            calories: value.calories,
            protein: value.protein,
            carbs: value.carbs,
            fats: value.fats,
            fiber: value.fiber ?? null,
            sugar: value.sugar ?? null,
            sodium: value.sodium ?? null,
          },
        });
      } else {
        await prisma.nutritionalValue.create({
          data: {
            recipeId: Number(id),
            calories: value.calories,
            protein: value.protein,
            carbs: value.carbs,
            fats: value.fats,
            fiber: value.fiber ?? null,
            sugar: value.sugar ?? null,
            sodium: value.sodium ?? null,
          },
        });
      }
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: {
        title,
        category,
        description,
        ingredients,
        isPublic: isPublic ?? existingRecipe.isPublic,
        imageUrl: imageUrl ?? existingRecipe.imageUrl,
      },
      include: { nutritionalValues: true },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error("PUT /api/recipes error:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Recipe ID and User ID are required" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id: Number(id), userId },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.recipe.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/recipes error:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
