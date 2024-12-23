import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: { user: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Lista de Libros</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">{book.titulo}</h2>
            <p className="text-gray-700 mb-1">Por: {book.autor}</p>
            <p className="text-gray-500 text-sm">Usuario: {book.user.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
