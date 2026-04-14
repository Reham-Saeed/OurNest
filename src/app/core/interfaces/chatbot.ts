export interface Message {
  id?: string;
  conversationId?: string;
  role: 'user' | 'ai' | 'User' | 'Assistant';
  content: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  modelId?: string;
  startedAt?: string;
  modelName?: string;
  title?: string;
  messages: Message[];
}