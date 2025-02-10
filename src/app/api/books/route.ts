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

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.warn("⚠️ User not found, creating a new one...");
      user = await prisma.user.create({
        data: {
          id: userId,
          name: "New User",
          email: `user${userId}@example.com`,
        },
      });
    }

    const books = await prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching books:", error);

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

    const { title, author, date, imageUrl, description, publisher, userId } =
      await request.json();

    if (!userId) {
      console.error("❌ Error: Missing userId in request.");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (typeof userId !== "string") {
      console.error("❌ Error: userId must be a string.");
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error("❌ Error: User ID not found in database.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        date: new Date(date),
        imageUrl,
        description,
        publisher,
        userId,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating book:", error);
    return NextResponse.json(
      {
        error: "Error creating book",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
