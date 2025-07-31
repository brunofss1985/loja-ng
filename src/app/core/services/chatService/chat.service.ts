import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from '../../models/chat.interface';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  // CORRIGIDO: Removido /api da URL
  private apiUrl = `${environment.apiUrl}/chatbot`;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // Headers para garantir UTF-8
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private initializeChat() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: 'Ola! Sou seu assistente inteligente. Como posso ajudar voce hoje?',
      isUser: false,
      timestamp: new Date(),
    };
    this.messagesSubject.next([welcomeMessage]);
  }

  sendMessage(message: string): Observable<ChatResponse> {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    const request: ChatRequest = { message };
    
    console.log('=== ENVIANDO PARA:', `${this.apiUrl}/chat`);
    console.log('=== PAYLOAD:', request);
    
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request, this.httpOptions);
  }

  addBotMessage(content: string) {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      content,
      isUser: false,
      timestamp: new Date(),
    };
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, botMessage]);
  }

  clearMessages() {
    this.initializeChat();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, this.httpOptions);
  }
}