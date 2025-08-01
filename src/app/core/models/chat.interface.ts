export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  userId?: string;
}

// CORRIGIDO: Interface agora bate com o backend
export interface ChatResponse {
  response: string;        // Backend retorna "response"
  source: string;          // Backend retorna "source" (openai/fallback/error)
  timestamp: string;       // Backend retorna "timestamp"
}

export interface QuickAction {
  label: string;
  message: string;
  icon?: string;
}