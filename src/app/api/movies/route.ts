import { validateAndFormatDate } from "@/app/movies/utils";
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

    let user = await prisma.user.findUnique({ where: { id: userId } });

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
    const {
      title,
      director,
      releaseDate,
      imageUrl,
      viewedDate,
      userId,
    }: {
      title: string;
      director?: string;
      releaseDate?: string;
      imageUrl?: string;
      viewedDate: string;
      userId: string;
    } = await request.json();

    if (!title || !viewedDate || !userId) {
      return NextResponse.json(
        { error: "Title, viewedDate, and userId are required" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validReleaseDate = releaseDate
      ? validateAndFormatDate(releaseDate)
      : null;
    const validViewedDate = validateAndFormatDate(viewedDate);

    if (!validViewedDate) {
      return NextResponse.json(
        { error: "Invalid viewedDate format" },
        { status: 400 }
      );
    }

    const newMovie = await prisma.movie.create({
      data: {
        title,
        director: director ?? "",
        releaseDate: validReleaseDate ? new Date(validReleaseDate) : null,
        imageUrl: imageUrl ?? null,
        viewedDate: new Date(validViewedDate),
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();

    const { title, director, releaseDate, imageUrl, viewedDate, userId } = body;
    const movieId = parseInt(id, 10);

    if (!movieId || !userId) {
      return NextResponse.json(
        { error: "Movie ID and userId are required" },
        { status: 400 }
      );
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title: title ?? existingMovie.title,
        director: director ?? existingMovie.director,
        releaseDate: releaseDate
          ? new Date(releaseDate).toISOString()
          : existingMovie.releaseDate
          ? new Date(existingMovie.releaseDate).toISOString()
          : null,
        imageUrl: imageUrl ?? existingMovie.imageUrl,
        viewedDate: viewedDate
          ? new Date(viewedDate + "T00:00:00.000Z").toISOString()
          : existingMovie.viewedDate
          ? new Date(existingMovie.viewedDate).toISOString()
          : existingMovie.viewedDate,
        updatedAt: new Date().toISOString(),
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
