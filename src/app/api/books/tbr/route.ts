import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      console.error("❌ Missing userId in query params!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const tbrBooks = await prisma.tBRBook.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
      select: { id: true, title: true },
    });

    return NextResponse.json(tbrBooks, { status: 200 });
  } catch (error) {
    console.error("❌ API Error fetching TBR books:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, userId } = await request.json();

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!userId) {
      console.error("❌ Missing userId in request body!");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const newTbrBook = await prisma.tBRBook.create({
      data: { title, userId },
    });

    return NextResponse.json(newTbrBook, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding TBR book:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Book ID and User ID are required" },
        { status: 400 }
      );
    }

    const book = await prisma.tBRBook.findFirst({
      where: { id, userId },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found or not owned by the user" },
        { status: 403 }
      );
    }

    await prisma.tBRBook.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "TBR book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting TBR book:", error);

    return NextResponse.json(
      {
        error: "Error deleting TBR book",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
