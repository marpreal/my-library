import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchMessages, sendMessageToAPI } from "../handlers/chatHandlers";

interface Message {
  id: string;
  senderId: string;
  content: string;
  sender: {
    name: string;
  };
}

export function useChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!session) return;

    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [session]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    const newMessage = await sendMessageToAPI(content);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    }
  };

  return { messages, content, setContent, sendMessage };
}
