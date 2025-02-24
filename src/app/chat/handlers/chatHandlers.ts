export const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };
  
  export const sendMessageToAPI = async (content: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to send message");
  
      return await res.json();
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };
  