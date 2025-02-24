import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get("recipientId");

    let messages;

    if (recipientId) {
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, recipientId },
            { senderId: recipientId, recipientId: session.user.id },
          ],
        },
        include: {
          sender: { select: { name: true, image: true, id: true } },
        },
        orderBy: { timestamp: "asc" },
      });
    } else {
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { recipientId: null },
            { senderId: session.user.id },
            { recipientId: session.user.id },
          ],
        },
        include: {
          sender: { select: { name: true, image: true, id: true } },
        },
        orderBy: { timestamp: "asc" },
      });
    }

    return NextResponse.json(messages ?? []);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, recipientId } = await req.json();
    if (!content.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: recipientId || null,
        content,
      },
      include: { sender: { select: { name: true, image: true, id: true } } },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
