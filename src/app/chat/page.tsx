"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useUserAndTheme } from "../hooks/useUserAndTheme";
import { useChat } from "./hooks/useChat";
import Image from "next/image";
import QuillEditor from "../components/QuillEditor";
import { SendHorizonal } from "lucide-react";

export default function ChatPage() {
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();
  const {
    messages,
    content,
    setContent,
    sendMessage,
    setPrivateChatUser,
    privateChatUser,
    privateChatUsers,
  } = useChat();
  const [privateChatMode, setPrivateChatMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSendMessage = () => {
    sendMessage();
  };

  return (
    <>
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />

      <div className="min-h-screen flex flex-col md:flex-row">
        <aside className="w-full md:w-1/4 bg-gray-200 dark:bg-gray-800 p-4 overflow-y-auto md:h-screen">
          <h2 className="text-lg font-bold mb-4">Private Chats</h2>
          <div className="space-y-2">
            {privateChatUsers.length > 0 ? (
              privateChatUsers
                .filter((user) => user?.id !== userName)
                .map((user) => (
                  <div
                    key={user?.id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md ${
                      privateChatUser === user?.id
                        ? "bg-gray-400 dark:bg-gray-600"
                        : ""
                    }`}
                    onClick={() => {
                      setPrivateChatUser(user?.id || null);
                      setPrivateChatMode(true);
                    }}
                  >
                    <Image
                      src={user?.image || "/default-avatar.png"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p className="ml-2">{user?.name}</p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No other users</p>
            )}
          </div>
          {privateChatMode && (
            <button
              className="w-full mt-4 p-2 bg-red-500 text-white rounded-md"
              onClick={() => {
                setPrivateChatUser(null);
                setPrivateChatMode(false);
              }}
            >
              Back to Public Chat
            </button>
          )}
        </aside>

        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            {privateChatMode
              ? `Chat with ${
                  privateChatUsers.find((u) => u?.id === privateChatUser)
                    ?.name || "User"
                }`
              : "Public Chat Room"}
          </h1>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-[75vh]">
            {messages
              .filter((msg) =>
                !privateChatMode
                  ? msg.recipientId === null
                  : msg.recipientId === privateChatUser ||
                    msg.senderId === privateChatUser ||
                    msg.senderId === userName
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 flex items-center ${
                    msg.senderId === userName ? "justify-end" : "justify-start"
                  }`}
                >
                  <Image
                    src={msg?.sender?.image || "/default-avatar.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 inline-block">
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </div>
                </div>
              ))}
          </div>

          <div className="relative mt-4 flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
            {isClient && (
              <div className="flex-1">
                <QuillEditor
                  value={content}
                  onChange={setContent}
                  onEnterPress={handleSendMessage}
                />
              </div>
            )}
            <button
              onClick={handleSendMessage}
              className="ml-2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
            >
              <SendHorizonal size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
