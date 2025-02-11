import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.movieReview.findMany({
      where: { movieId: parseInt(id, 10) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { review, rating, userId } = await request.json();

  if (!id || !review || rating == null || !userId) {
    return NextResponse.json(
      { error: "Movie ID, review text, rating, and user ID are required" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.movieReview.create({
      data: {
        movieId: parseInt(id, 10),
        review,
        rating,
        userId,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { reviewId, review, rating, userId } = await request.json();

  if (!id || !reviewId || !userId || (!review && rating == null)) {
    return NextResponse.json(
      {
        error:
          "Movie ID, review ID, user ID, and at least one field to update are required",
      },
      { status: 400 }
    );
  }

  try {
    const existingReview = await prisma.movieReview.findUnique({
      where: { id: parseInt(reviewId, 10) },
      select: { userId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own reviews" },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.movieReview.update({
      where: { id: parseInt(reviewId, 10) },
      data: {
        ...(review && { review }),
        ...(rating != null && { rating }),
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating review:", error);
    return NextResponse.json(
      { error: "Error updating review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { reviewId, userId } = await request.json();

  if (!id || !reviewId || !userId) {
    return NextResponse.json(
      { error: "Movie ID, review ID, and user ID are required" },
      { status: 400 }
    );
  }

  try {
    const existingReview = await prisma.movieReview.findUnique({
      where: { id: parseInt(reviewId, 10) },
      select: { userId: true },
    });

    if (!existingReview || existingReview.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await prisma.movieReview.delete({
      where: { id: parseInt(reviewId, 10) },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return NextResponse.json(
      { error: "Error deleting review" },
      { status: 500 }
    );
  }
}
