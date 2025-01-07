import { validateAndFormatDate } from "@/app/movies/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { releaseDate: "desc" },
      select: {
        id: true,
        title: true,
        director: true,
        releaseDate: true,
        viewedDate: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Error fetching movies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const {
    title,
    director,
    releaseDate,
    imageUrl,
    description,
    genre,
    viewedDate,
  } = await request.json();

  if (!viewedDate) {
    return NextResponse.json(
      { error: "viewedDate is required" },
      { status: 400 }
    );
  }

  const validReleaseDate = validateAndFormatDate(releaseDate);
  const validViewedDate = validateAndFormatDate(viewedDate);

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        director,
        releaseDate: validReleaseDate ? new Date(validReleaseDate) : null,
        imageUrl,
        description,
        genre,
        viewedDate: validViewedDate ? new Date(validViewedDate) : null,
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Error creating movie" },
      { status: 500 }
    );
  }
}
