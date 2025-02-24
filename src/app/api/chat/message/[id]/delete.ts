import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth";
import prisma from "../../../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messageId = params.id;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.senderId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this message" },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
