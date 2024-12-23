import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], 
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  const { titulo, autor } = await request.json();

  try {
    const newBook = await prisma.book.create({
      data: { titulo, autor },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error al crear el libro:', (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || 'Error al crear el libro' },
      { status: 500 }
    );
  }
}
