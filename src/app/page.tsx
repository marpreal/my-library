export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">My Library</h1>
        <p className="text-gray-700 text-lg mb-6">
          Manage your books and users easily.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="/books"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Books
          </a>
        </div>
      </div>
    </div>
  );
}
