import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const movies = await prisma.movie.findMany({
      where: { userId },
      orderBy: { viewedDate: "desc" },
    });

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching movies:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, director, releaseDate, imageUrl, viewedDate, userId } =
      await request.json();

    if (!title || !viewedDate || !userId) {
      return NextResponse.json(
        { error: "Title, viewedDate, and userId are required" },
        { status: 400 }
      );
    }

    const newMovie = await prisma.movie.create({
      data: {
        title,
        director: director ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        imageUrl: imageUrl ?? null,
        viewedDate: new Date(viewedDate),
        userId,
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating movie:", error);
    return NextResponse.json(
      { error: "Error creating movie" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { title, director, releaseDate, imageUrl, viewedDate, userId } =
      await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId, 10) },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(movieId, 10) },
      data: {
        title: title ?? existingMovie.title,
        director: director ?? existingMovie.director,
        releaseDate: releaseDate
          ? new Date(releaseDate)
          : existingMovie.releaseDate,
        imageUrl: imageUrl ?? existingMovie.imageUrl,
        viewedDate: new Date(viewedDate), // ✅ Ensure correct format
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("id");
    const { userId } = await request.json();

    if (!movieId || !userId) {
      return NextResponse.json(
        { error: "Movie ID and userId are required" },
        { status: 400 }
      );
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId, 10) },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await prisma.movie.delete({
      where: { id: parseInt(movieId, 10) },
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
