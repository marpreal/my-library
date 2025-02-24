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
