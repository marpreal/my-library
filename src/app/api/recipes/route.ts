import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fetch recipes by category or all recipes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  try {
    if (id) {
      const recipe = await prisma.recipe.findUnique({
        where: { id: Number(id) },
      });
      return NextResponse.json(recipe, { status: 200 });
    }

    const recipes = await prisma.recipe.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recipes, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// Add a new recipe
export async function POST(request: Request) {
  try {
    const { title, category, description, ingredients } = await request.json();

    if (!title || !category || !ingredients || !ingredients.length) {
      return NextResponse.json(
        { error: "Title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    const newRecipe = await prisma.recipe.create({
      data: { title, category, description, ingredients },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

// Edit a recipe
export async function PUT(request: Request) {
  try {
    const { id, title, category, description, ingredients } = await request.json();

    if (!id || !title || !category || !ingredients || !ingredients.length) {
      return NextResponse.json(
        { error: "ID, title, category, and ingredients are required" },
        { status: 400 }
      );
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: { title, category, description, ingredients },
    });

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// Delete a recipe
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    await prisma.recipe.delete({ where: { id } });

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
