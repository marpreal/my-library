import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        title: true,
        author: true,
        date: true,
        imageUrl: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error fetching book:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error fetching book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.book.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error deleting book" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, author, date, imageUrl } = await request.json();

  if (!id || !title || !author || !date) {
    return NextResponse.json(
      { error: "ID, title, author, and date are required" },
      { status: 400 }
    );
  }

  try {
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
    console.error("Error updating book:", (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || "Error updating book" },
      { status: 500 }
    );
  }
}
