import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  fetchMessages,
  sendMessageToAPI,
  fetchChatUsers,
} from "../handlers/chatHandlers";
import { ChatUser, Message } from "../page.types";

export function useChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [privateChatUser, setPrivateChatUser] = useState<string | null>(null);
  const [privateChatUsers, setPrivateChatUsers] = useState<ChatUser[]>(
    () => []
  );

  const lastPrivateChatUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const loadMessages = async () => {
      if (
        privateChatUser &&
        privateChatUser !== lastPrivateChatUserRef.current
      ) {
        const fetchedMessages = await fetchMessages(privateChatUser);
        setMessages(fetchedMessages);
        lastPrivateChatUserRef.current = privateChatUser;
      } else if (!privateChatUser) {
        const fetchedMessages = await fetchMessages();
        setMessages(fetchedMessages);
      }
    };

    const loadChatUsers = async () => {
      const users = await fetchChatUsers();
      setPrivateChatUsers(users);
    };

    loadMessages();
    loadChatUsers();

    const interval = setInterval(() => {
      if (privateChatUser !== lastPrivateChatUserRef.current) {
        loadMessages();
      }
    }, 3000);

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
    setMessages,
    content,
    setContent,
    sendMessage,
    setPrivateChatUser,
    privateChatUser,
    privateChatUsers,
  };
}
