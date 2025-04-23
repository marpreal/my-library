import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        ShoppingCart: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!user || user.ShoppingCart.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const cart = user.ShoppingCart[0];
    return NextResponse.json(cart.items, { status: 200 });
  } catch (error) {
    console.error("GET /api/shopping-cart error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, quantity } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ShoppingCart: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let cart = user.ShoppingCart[0];

    if (!cart) {
      cart = await prisma.shoppingCart.create({
        data: {
          userId: user.id,
        },
      });
    }

    const item = await prisma.shoppingItem.create({
      data: {
        name,
        quantity,
        shoppingCartId: cart.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/shopping-cart error:", error);
    return NextResponse.json(
      { error: "Failed to add shopping item" },
      { status: 500 }
    );
  }
}
