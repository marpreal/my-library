import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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
          OR: [...(userId ? [{ userId }] : []), { isPublic: true }],
        },
        include: {
          nutritionalValues: true,
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
      });

      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found or unauthorized" },
          { status: 404 }
        );
      }
      return NextResponse.json(recipe, { status: 200 });
    }

    let recipes: unknown[] = [];

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
        },
      });
    }

    return NextResponse.json(recipes, { status: 200 });
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
    const body = await request.json();

    if (body.content && body.recipeId && body.userId) {
      const newComment = await prisma.comment.create({
        data: {
          content: body.content,
          userId: body.userId,
          recipeId: Number(body.recipeId),
        },
        include: {
          user: { select: { name: true } },
        },
      });

      return NextResponse.json(newComment, { status: 201 });
    }

    const {
      title,
      category,
      description,
      ingredients,
      userId,
      nutritionalValues,
      isPublic,
    } = body;

    if (
      !userId ||
      !title ||
      !category ||
      !ingredients ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "User ID, title, category, and ingredients are required" },
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
        isPublic: isPublic ?? false,
        nutritionalValues: {
          create: nutritionalValues ?? [],
        },
      },
      include: { nutritionalValues: true },
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
    } = await request.json();

    if (!id || !title || !category || !ingredients.length)
      return NextResponse.json(
        { error: "ID, title, category, and ingredients are required" },
        { status: 400 }
      );

    if (!userId)
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );

    const recipe = await prisma.recipe.findFirst({
      where: { id: Number(id), userId },
      include: { nutritionalValues: true },
    });

    if (!recipe) {
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
        isPublic: isPublic ?? recipe.isPublic,
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
    const { id, commentId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (commentId) {
      const comment = await prisma.comment.findFirst({
        where: { id: Number(commentId), userId },
      });

      if (!comment) {
        return NextResponse.json(
          { error: "Comment not found or unauthorized" },
          { status: 403 }
        );
      }

      await prisma.comment.delete({ where: { id: Number(commentId) } });

      return NextResponse.json(
        { message: "Comment deleted successfully" },
        { status: 200 }
      );
    }

    if (id) {
      const recipe = await prisma.recipe.findFirst({
        where: { id: Number(id), userId },
        include: { comments: true, nutritionalValues: true },
      });

      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found or unauthorized" },
          { status: 404 }
        );
      }

      await prisma.comment.deleteMany({
        where: { recipeId: Number(id) },
      });

      await prisma.nutritionalValue.deleteMany({
        where: { recipeId: Number(id) },
      });

      await prisma.recipe.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json(
        { message: "Recipe deleted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "No valid ID provided for deletion" },
      { status: 400 }
    );
  } catch (error) {
    console.error("DELETE /api/recipes error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
