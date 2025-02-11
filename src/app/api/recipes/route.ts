import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      console.error("❌ Missing userId in request");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const category = searchParams.get("category");
    const id = searchParams.get("id");

    if (id) {
      const recipe = await prisma.recipe.findFirst({
        where: { id: Number(id), userId },
      });

      if (!recipe) {
        return NextResponse.json(
          { error: "Recipe not found or unauthorized" },
          { status: 404 }
        );
      }
      return NextResponse.json(recipe, { status: 200 });
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        userId,
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

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
    const { title, category, description, ingredients, userId } =
      await request.json();

    if (!userId) {
      console.error("❌ Missing userId in request.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!title || !category || !ingredients || !ingredients.length) {
      return NextResponse.json(
        { error: "Title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      console.error("❌ User not found in database.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        category,
        description,
        ingredients,
        userId,
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
    const { id, title, category, description, ingredients, userId } =
      await request.json();

    if (!id || !title || !category || !ingredients || !ingredients.length) {
      return NextResponse.json(
        { error: "ID, title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error("❌ Missing userId in request.");
      return NextResponse.json(
        { error: "User ID is required" },
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

    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(id) },
      data: { title, category, description, ingredients },
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
        { error: "Recipe ID and userId are required" },
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
