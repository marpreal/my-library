import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-yellow-100 to-pink-200">
      <div className="text-center p-8 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full">
        <h1 className="text-5xl font-bold text-orange-700 mb-4 drop-shadow-md">
          My Library
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Like BookReads but better.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/books"
            className="px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-orange-700 transition transform hover:scale-105"
          >
            Explore Books
          </Link>
        </div>
      </div>
    </div>
  );
}
