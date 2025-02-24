export interface Message {
  id: string;
  senderId: string;
  recipientId?: string | null;
  content: string;
  sender: {
    name: string;
    image?: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  image?: string;
}