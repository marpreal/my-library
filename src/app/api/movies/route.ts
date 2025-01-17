import { validateAndFormatDate } from "@/app/movies/utils";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { viewedDate: "desc" },
      select: {
        id: true,
        title: true,
        director: true,
        releaseDate: true,
        viewedDate: true,
        imageUrl: true,
        createdAt: true,
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
    viewedDate,
  }: {
    title: string;
    director?: string;
    releaseDate?: string;
    imageUrl?: string;
    viewedDate: string;
  } = await request.json();

  if (!title || !viewedDate) {
    return NextResponse.json(
      { error: "Title and viewedDate are required" },
      { status: 400 }
    );
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

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        director: director ? director : "",
        releaseDate: validReleaseDate ? new Date(validReleaseDate) : "",
        imageUrl: imageUrl ? imageUrl : "",
        viewedDate: new Date(validViewedDate),
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
