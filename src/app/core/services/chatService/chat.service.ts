import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from '../../models/chat.interface';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chatbot`;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // CORRIGIDO: Removido header problemático
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
      content: '👋 Olá! Sou o assistente inteligente da **SupplementStore**!\n\nPosso ajudar com:\n• Informações sobre produtos\n• Preços e promoções\n• Frete e entrega\n• Dicas de uso\n\nComo posso ajudar você hoje? 😊',
      isUser: false,
      timestamp: new Date(),
    };
    this.messagesSubject.next([welcomeMessage]);
  }

  sendMessage(message: string): Observable<ChatResponse> {
    console.log('=== CHAT SERVICE - ENVIANDO MENSAGEM ===');
    console.log('URL:', `${this.apiUrl}/chat`);
    console.log('Mensagem:', message);

    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    const request: ChatRequest = { message };
    
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('=== RESPOSTA RECEBIDA NO SERVICE:', response);
        }),
        catchError(error => {
          console.error('=== ERRO NO SERVICE:', error);
          
          const errorResponse: ChatResponse = {
            response: '⚠️ **Erro de conexão**\n\nNão foi possível conectar com o servidor.\n\n**Tente:**\n• Verificar sua conexão\n• Recarregar a página\n• Contatar suporte se persistir\n\n📞 (11) 3333-4444',
            source: 'error',
            timestamp: new Date().toISOString()
          };
          
          return of(errorResponse);
        })
      );
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
    console.log('=== VERIFICANDO HEALTH ===');
    return this.http.get(`${this.apiUrl}/health`, this.httpOptions)
      .pipe(
        tap(response => console.log('=== HEALTH OK:', response)),
        catchError(error => {
          console.error('=== HEALTH ERROR:', error);
          return of({ status: 'offline' });
        })
      );
  }
}