import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

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

  const item = await prisma.shoppingItem.findUnique({
    where: { id: parseInt(id) },
    include: {
      shoppingCart: {
        select: { userId: true },
      },
    },
  });

  if (!item || item.shoppingCart.userId !== user.id) {
    return NextResponse.json(
      { error: "Item not found or unauthorized" },
      { status: 404 }
    );
  }

  await prisma.shoppingItem.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json(
    { message: "Item deleted successfully" },
    { status: 200 }
  );
}
