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
export interface ChatResponse {
  response: string;
  timestamp: string;
  success: boolean;
}
export interface QuickAction {
  label: string;
  message: string;
  icon?: string;
}
