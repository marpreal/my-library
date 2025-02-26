import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { recipeId, userId, value } = await request.json();

    if (
      !recipeId ||
      !userId ||
      typeof value !== "number" ||
      value < 1 ||
      value > 5
    ) {
      return NextResponse.json(
        { error: "Invalid rating value (must be between 1 and 5)" },
        { status: 400 }
      );
    }

    const existingRating = await prisma.rating.findFirst({
      where: { recipeId, userId },
    });

    let rating;
    if (existingRating) {
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value },
      });
    } else {
      rating = await prisma.rating.create({
        data: { recipeId, userId, value },
      });
    }

    return NextResponse.json(rating, { status: 200 });
  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const ratings = await prisma.rating.findMany({
      where: { recipeId: Number(recipeId) },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length
        : 0;

    return NextResponse.json({ ratings, averageRating }, { status: 200 });
  } catch (error) {
    console.error("GET /api/ratings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
