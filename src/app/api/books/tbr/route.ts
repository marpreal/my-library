import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Starting GET request for TBR books...");
    const tbrBooks = await prisma.tBRBook.findMany({
      orderBy: { addedAt: "desc" },
      select: { id: true, title: true },
    });
    console.log("Fetched TBR books successfully:", tbrBooks);
    return NextResponse.json(tbrBooks, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching TBR books:", err.message, err.stack);
    return NextResponse.json(
      { error: "Error fetching TBR books", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    console.log("Received title:", title);

    if (!title || title.trim() === "") {
      console.error("Validation error: Title is required");
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTbrBook = await prisma.tBRBook.create({
      data: { title },
    });
    return NextResponse.json(newTbrBook, { status: 201 });
  } catch (error) {
    const err = error as Error;
    console.error("Error adding TBR book:", err.message, err.stack);
    return NextResponse.json(
      { error: "Error adding TBR book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log("Received ID:", id);

    if (!id) {
      console.error("Validation error: ID is required");
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.tBRBook.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "TBR book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error deleting TBR book:", err.message, err.stack);
    return NextResponse.json(
      { error: "Error deleting TBR book" },
      { status: 500 }
    );
  }
}
