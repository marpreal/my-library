import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  fetchMessages,
  sendMessageToAPI,
  fetchChatUsers,
} from "../handlers/chatHandlers";

interface Message {
  id: string;
  senderId: string;
  recipientId?: string | null;
  content: string;
  sender: {
    name: string;
    image?: string;
  };
}

interface ChatUser {
  id: string;
  name: string;
  image?: string;
}

export function useChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [privateChatUser, setPrivateChatUser] = useState<string | null>(null);
  const [privateChatUsers, setPrivateChatUsers] = useState<ChatUser[]>(() => []);

  useEffect(() => {
    if (!session) return;

    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(privateChatUser ?? undefined);
      setMessages(fetchedMessages);
    };

    const loadChatUsers = async () => {
      const users = await fetchChatUsers();
      setPrivateChatUsers(users);
    };

    loadMessages();
    loadChatUsers();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [session, privateChatUser]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    const newMessage = await sendMessageToAPI(content, privateChatUser);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    }
  };

  return {
    messages,
    content,
    setContent,
    sendMessage,
    setPrivateChatUser,
    privateChatUser,
    privateChatUsers,
  };
}
