import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, QuickAction } from 'src/app/core/models/chat.interface';
import { ChatService } from 'src/app/core/services/chatService/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isOpen = false;
  isTyping = false;
  isOnline = true;
  quickActions: QuickAction[] = [
    {
      label: 'Produtos para ganhar massa',
      message: 'Quais produtos vocês têm para ganhar massa muscular?',
    },
    {
      label: 'Horários de entrega',
      message: 'Quais são os horários de entrega?',
    },
    { label: 'Como usar whey', message: 'Como devo usar o whey protein?' },
    { label: 'Informações sobre frete', message: 'Como funciona o frete?' },
  ];
  private subscription = new Subscription();
  constructor(private chatService: ChatService) {}
  ngOnInit() {
    this.subscription.add(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      })
    );
    this.checkServiceHealth();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.messageInput?.nativeElement.focus(), 100);
    }
  }
sendMessage() {
  console.log('=== MÉTODO SEND MESSAGE CHAMADO ===');
  console.log('=== MENSAGEM ATUAL:', this.currentMessage);
  console.log('=== IS ONLINE:', this.isOnline);
  
  if (!this.currentMessage.trim() || !this.isOnline) {
    console.log('=== SAINDO: MENSAGEM VAZIA OU OFFLINE ===');
    return;
  }
  
  const message = this.currentMessage.trim();
  this.currentMessage = '';
  this.isTyping = true;

  console.log('=== CHAMANDO CHAT SERVICE ===');

  this.chatService.sendMessage(message).subscribe({
    next: (response) => {
      console.log('=== RESPOSTA RECEBIDA NO COMPONENT:', response);
      this.chatService.addBotMessage(response.response);
      this.isTyping = false;
    },
    error: (error) => {
      console.error('=== ERRO NO COMPONENT:', error);
      this.chatService.addBotMessage('Desculpe, ocorreu um erro. Tente novamente.');
      this.isTyping = false;
    }
  });
}
  sendQuickAction(action: QuickAction) {
    this.currentMessage = action.message;
    this.sendMessage();
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
  private checkServiceHealth() {
    this.chatService
      .checkHealth()
      .subscribe({
        next: () => (this.isOnline = true),
        error: () => (this.isOnline = false),
      });
  }
  clearChat() {
    this.chatService.clearMessages();
  }
}
