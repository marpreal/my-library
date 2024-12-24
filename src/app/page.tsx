import Link from "next/link";

export default function Home() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md max-w-md w-full border border-gray-200">
        <h1 className="text-5xl font-bold text-highlight mb-4 drop-shadow-md">
          Marta&apos;s Library
        </h1>

        <p className="text-gray-700 text-lg italic mb-6 hover:text-olive transition">
          Like BookReads but with timeless elegance.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/books"
            className="px-6 py-3 bg-accent text-highlight border-2 border-highlight rounded-full shadow-lg hover:shadow-xl hover:bg-highlight hover:text-olive transition transform hover:scale-105"
          >
            Explore Books
          </Link>
        </div>
      </div>
    </div>
  );
}
