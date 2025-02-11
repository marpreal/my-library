import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        reviews: {
          select: {
            id: true,
            review: true,
            rating: true,
            userId: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: "Error fetching book" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await request.json();

  if (!id || !userId) {
    return NextResponse.json(
      { error: "ID and userId are required" },
      { status: 400 }
    );
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own books" },
        { status: 403 }
      );
    }

    await prisma.book.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Error deleting book" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, author, date, imageUrl, userId } = await request.json();

  if (!id || !title || !author || !date || !userId) {
    return NextResponse.json(
      { error: "ID, title, author, date, and userId are required" },
      { status: 400 }
    );
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own books" },
        { status: 403 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        author,
        date: new Date(date),
        imageUrl,
      },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ error: "Error updating book" }, { status: 500 });
  }
}
