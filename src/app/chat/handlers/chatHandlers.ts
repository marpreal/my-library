import { Message } from "../page.types";

export const fetchMessages = async (recipientId?: string) => {
  try {
    const url = recipientId
      ? `/api/chat?recipientId=${recipientId}`
      : "/api/chat";
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const sendMessageToAPI = async (
  content: string,
  recipientId?: string | null
) => {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ content, recipientId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to send message");

    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

export const fetchChatUsers = async () => {
  try {
    const res = await fetch("/api/chat/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("Error fetching chat users:", error);
    return [];
  }
};

export const handleEditMessage = async (
  messageId: string,
  newContent: string
) => {
  try {
    const response = await fetch(`/api/chat/message/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ content: newContent }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("Message edited successfully");
    }
  } catch (error) {
    console.error("Error editing message:", error);
    alert("Failed to edit message");
  }
};

export const handleDelete = async (
  messageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  try {
    const response = await fetch(`/api/chat/message/${messageId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("Message deleted successfully");

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    alert("Failed to delete message");
  }
};
