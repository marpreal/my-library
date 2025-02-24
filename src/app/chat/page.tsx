"use client";

import Navbar from "../components/Navbar";
import { useUserAndTheme } from "../hooks/useUserAndTheme";
import { useChat } from "./hooks/useChat";

export default function ChatPage() {
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();
  const { messages, content, setContent, sendMessage } = useChat();

  return (
    <>
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />

      <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold">Public Chat Room</h1>

        <div className="w-full max-w-md mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-96 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 ${
                  msg.senderId === userName ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-semibold">{msg.sender.name}</p>
                <p className="bg-blue-500 text-white rounded-lg px-4 py-2 inline-block mt-1">
                  {msg.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet
            </p>
          )}
        </div>

        <div className="flex w-full max-w-md mt-4">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-2 border rounded-l-md dark:bg-gray-800"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
