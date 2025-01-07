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
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        title: true,
        director: true,
        releaseDate: true,
        imageUrl: true,
        viewedDate: true,
        description: true,
        genre: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie:", (error as Error).message);
    return NextResponse.json(
      { error: "Error fetching movie" },
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
    await prisma.movie.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json(
      { message: "Movie deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting movie:", (error as Error).message);
    return NextResponse.json(
      { error: "Error deleting movie" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, director, releaseDate, imageUrl, description, genre } =
    await request.json();

  let formattedReleaseDate = null;
  if (releaseDate) {
    try {
      formattedReleaseDate = new Date(releaseDate).toISOString();
    } catch (error) {
      console.error("Invalid releaseDate:", releaseDate, "Error:", error);
    }
  }

  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        director: director || null,
        releaseDate: formattedReleaseDate
          ? new Date(formattedReleaseDate)
          : null,
        imageUrl,
        description,
        genre,
      },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("Error updating movie:", (error as Error).message);
    return NextResponse.json(
      { error: "Error updating movie" },
      { status: 500 }
    );
  }
}
