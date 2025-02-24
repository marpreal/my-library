import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "../../../../../../lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messageId = (await context.params).id as string;

    const { content } = await req.json();

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { sender: true },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to edit this message" },
        { status: 403 }
      );
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Failed to edit message:", error);
    return NextResponse.json(
      { error: "Failed to edit message" },
      { status: 500 }
    );
  }
}