type SaveBookResponse = {
  id: number;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  userId: string;
};

type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
};

export const saveBook = async (
  book: {
    title: string;
    author: string;
    date: string;
    imageUrl: string;
    userId: string;
  },
  bookId?: string
): Promise<SaveBookResponse> => {
  if (!book.title || !book.author || !book.date || !book.userId) {
    throw new Error(
      "🚨 Missing required fields: title, author, date, or userId"
    );
  }

  const method = bookId ? "PATCH" : "POST";
  const url = bookId ? `/api/books/${bookId}` : "/api/books";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ API responded with status ${response.status}`);
      console.error("❌ API Response Body:", text);
      throw new Error(`API error: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error in saveBook:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error in saveBook"
    );
  }
};

export const searchBooks = async (query: string): Promise<GoogleBook[]> => {
  const cleanQuery = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .trim();

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      cleanQuery
    )}&maxResults=10`
  );

  if (!response.ok) {
    throw new Error("Error fetching books");
  }

  const data = await response.json();
  return (data.items || []) as GoogleBook[];
};
