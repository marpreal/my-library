import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.movieReview.findMany({
      where: { movieId: parseInt(id, 10) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", (error as Error).message);
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { review, rating } = await request.json();

  if (!id || !review || rating == null) {
    return NextResponse.json(
      { error: "Movie ID, review text, and rating are required" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.movieReview.create({
      data: {
        movieId: parseInt(id, 10),
        review,
        rating,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error creating review" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { reviewId, review, rating } = await request.json();

  if (!id || !reviewId || (!review && rating == null)) {
    return NextResponse.json(
      {
        error:
          "Movie ID, review ID, and at least one field to update are required",
      },
      { status: 400 }
    );
  }

  try {
    const updatedReview = await prisma.movieReview.update({
      where: { id: parseInt(reviewId, 10) },
      data: {
        ...(review && { review }),
        ...(rating != null && { rating }),
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error updating review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { reviewId } = await request.json();

  if (!id || !reviewId) {
    return NextResponse.json(
      { error: "Movie ID and review ID are required" },
      { status: 400 }
    );
  }

  try {
    await prisma.movieReview.delete({
      where: { id: parseInt(reviewId, 10) },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error deleting review" },
      { status: 500 }
    );
  }
}
