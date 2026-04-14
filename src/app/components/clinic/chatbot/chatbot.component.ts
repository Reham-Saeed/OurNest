import { Component, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Conversation, Message } from '../../../core/interfaces/chatbot';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chatbot',
  imports: [DecimalPipe, CommonModule, FormsModule, NgxSpinnerComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private _AiService: AiService) {}

  @Input() conversationId!: string | null;

  messages: Message[] = [];
  newMessage: string = '';
  loading = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversationId']) {
      this.loadMessages();
    }
  }

  loadMessages() {
    if (!this.conversationId) {
      this.messages = [];
      return;
    }

    this.loading = true;

    this._AiService.getMessages(this.conversationId).subscribe({
      next: (res) => {
        this.messages = res;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    if (!this.conversationId) {
      this.createNewConversationAndSend();
    } else {
      this.sendToExistingConversation();
    }
  }

  createNewConversationAndSend() {
    const maxLength = 50;
    const title =
      this.newMessage.length > maxLength
        ? this.newMessage.slice(0, maxLength) + '...'
        : this.newMessage;

    const userId = 'FF60A8B0-42C1-4B94-BFBE-B0036C9D0EDA';

    this.loading = true;

    this._AiService.createConversation(userId, title).subscribe({
      next: (conv) => {
        this.conversationId = conv.id;
        this._AiService.notifyConversationsChanged();
        this.sendToExistingConversation();
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  sendToExistingConversation() {
    const content = this.newMessage;

    this.loading = true;

    this.messages.push({
      content,
      role: 'user',
    });

    this.newMessage = '';

    this._AiService.sendMessage(this.conversationId!, content).subscribe({
      next: (res: any) => {
        this.messages.push({
          content: res.reply || res.content,
          role: 'ai',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatMessage(content: string): string {
    if (!content) return '';

    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/^###\s?(.*)/gm, '<h3>$1</h3>');
    content = content.replace(/^- (.*$)/gm, '• $1');
    content = content.replace(/\n/g, '<br>');

    return content;
  }
}
