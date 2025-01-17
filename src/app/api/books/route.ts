import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        author: true,
        date: true,
        imageUrl: true, 
      },
    });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Error fetching books" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { title, author, date, imageUrl, description, publisher } =
    await request.json();

  try {
    const newBook = await prisma.book.create({
      data: { title, author, date: new Date(date), imageUrl, description, publisher },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Error creating book" }, { status: 500 });
  }
}
