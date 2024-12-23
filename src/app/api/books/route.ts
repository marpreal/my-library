import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { titulo, autor } = await request.json();

  try {
    const newBook = await prisma.book.create({
      data: { titulo, autor }, // Eliminamos userId
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error al crear el libro:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Error al crear el libro' },
      { status: 500 }
    );
  }
}
