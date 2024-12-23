import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { titulo, autor, userId } = await request.json();

  try {
    // Verificar si el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: `El usuario con ID ${userId} no existe` },
        { status: 400 }
      );
    }

    // Crear el libro si el usuario existe
    const newBook = await prisma.book.create({
      data: { titulo, autor, userId },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error al crear el libro:', error);
    return NextResponse.json({ error: 'Error al crear el libro' }, { status: 500 });
  }
}
