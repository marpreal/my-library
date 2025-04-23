import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MealInput {
  type: string;
  foodName: string;
  notes?: string;
}

interface DailyDietUpdateInput {
  id: number;
  date: string;
  meals: MealInput[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (date) {
      const dailyDiet = await prisma.dailyDiet.findFirst({
        where: {
          userId: user.id,
          date: new Date(date),
        },
        include: {
          meals: {
            include: {
              recipe: true,
            },
          },
        },
      });

      return NextResponse.json(dailyDiet ?? {}, { status: 200 });
    }

    const allDiets = await prisma.dailyDiet.findMany({
      where: {
        userId: user.id,
      },
      include: {
        meals: {
          include: {
            recipe: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(allDiets, { status: 200 });
  } catch (error) {
    console.error("GET /api/daily-diet error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: DailyDietUpdateInput = await request.json();
    const { id, date, meals } = body;

    if (!id || !date || !meals?.length) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    await prisma.meal.deleteMany({ where: { dailyDietId: id } });

    const mealData = await Promise.all(
      meals.map(async (meal): Promise<{ type: string; notes?: string; recipe: { connect: { id: number } } }> => {
        const title = meal.foodName.trim();
        let recipe = await prisma.recipe.findFirst({
          where: { title, userId: user.id },
        });

        if (!recipe) {
          recipe = await prisma.recipe.create({
            data: {
              title,
              userId: user.id,
              category: "Daily",
              ingredients: [],
              isPublic: false,
            },
          });
        }

        return {
          type: meal.type,
          notes: meal.notes,
          recipe: { connect: { id: recipe.id } },
        };
      })
    );

    const updated = await prisma.dailyDiet.update({
      where: { id },
      data: {
        date: new Date(date),
        meals: { create: mealData },
      },
      include: {
        meals: { include: { recipe: true } },
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/daily-diet error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
