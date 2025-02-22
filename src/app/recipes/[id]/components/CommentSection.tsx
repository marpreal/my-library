"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CommentSection({
  recipeId,
  comments: initialComments = [],
}: {
  recipeId: number;
  comments?: {
    id: number;
    content: string;
    userId: string;
    user: { name?: string };
  }[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments ?? []);
  const [newComment, setNewComment] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    const response = await fetch(`/api/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        userId: session.user.id,
        recipeId,
      }),
    });

    if (response.ok) {
      const comment = await response.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    }
  }

  async function handleDelete(commentId: number) {
    if (!session) return;

    const response = await fetch(`/api/recipes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commentId,
        userId: session.user.id,
      }),
    });

    if (response.ok) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } else {
      console.error("Failed to delete comment");
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {session ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-[#DAA520] text-white py-2 px-4 rounded"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Log in to post a comment.</p>
      )}

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-2 flex justify-between items-center">
            <p className="font-semibold">{comment.user.name || "Anonymous"}</p>
            <p className="text-gray-700">{comment.content}</p>
            {session?.user?.id === comment.userId && (
              <button onClick={() => handleDelete(comment.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
