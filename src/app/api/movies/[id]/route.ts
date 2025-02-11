import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        title: true,
        director: true,
        releaseDate: true,
        imageUrl: true,
        viewedDate: true,
        userId: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching movie:", error);
    return NextResponse.json(
      { error: "Error fetching movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { userId } = await request.json();

  if (!id || !userId) {
    return NextResponse.json(
      { error: "Movie ID and userId are required" },
      { status: 400 }
    );
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (movie.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own movies" },
        { status: 403 }
      );
    }

    await prisma.movie.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      { message: "Movie deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting movie:", error);
    return NextResponse.json(
      { error: "Error deleting movie" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { title, director, releaseDate, imageUrl, userId } =
    await request.json();

  if (!id || !title || !userId) {
    return NextResponse.json(
      { error: "ID, title, and userId are required" },
      { status: 400 }
    );
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    if (movie.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only edit your own movies" },
        { status: 403 }
      );
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        director: director || null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        imageUrl,
      },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating movie:", error);
    return NextResponse.json(
      { error: "Error updating movie" },
      { status: 500 }
    );
  }
}
