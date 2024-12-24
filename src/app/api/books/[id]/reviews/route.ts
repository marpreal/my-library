import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { bookId: parseInt(id, 10) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error fetching reviews" },
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
      { error: "Book ID, review text, and rating are required" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        bookId: parseInt(id, 10),
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
