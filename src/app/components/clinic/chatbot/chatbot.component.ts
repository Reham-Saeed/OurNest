import { Component, ElementRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Conversation, Message } from '../../../core/interfaces/chatbot';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  imports: [DecimalPipe, CommonModule, FormsModule, NgxSpinnerComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private _AiService: AiService,
    private _AuthService: AuthService,
  ) {}

  @Input() conversationId!: string | null;
  @Input() resetKey!: number;

  messages: Message[] = [];
  newMessage: string = '';
  loading = false;
  private shouldScroll = false;
  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTo({
        top: this.chatContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch {}
  }
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversationId']) {
      this.messages = [];
      this.newMessage = '';
      this.loading = false;

      this.loadMessages();
    }

    if (changes['resetKey']) {
      this.messages = [];
      this.newMessage = '';
      this.loading = false;
      this.conversationId = null;
    }
  }

  loadMessages() {
    if (!this.conversationId) {
      this.messages = [];
      this.loading = false;
      return;
    }

    this.loading = true;

    this._AiService.getMessages(this.conversationId).subscribe({
      next: (res) => {
        this.messages = res;
        this.loading = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.loading = false;
        this.messages = [];
      },
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private creatingConversation = false;
  sendMessage() {
    if (!this.newMessage.trim()) return;

    if (!this.conversationId) {
      if (this.creatingConversation) return;
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

    const user = this._AuthService.getUser();
    const userId = user?.id;

    if (!userId) {
      console.error('No user found');
      return;
    }

    this.loading = true;

    this.creatingConversation = true;

    this._AiService.createConversation(userId, title).subscribe({
      next: (conv) => {
        this.conversationId = conv.id;
        this._AiService.notifyConversationsChanged();

        this.creatingConversation = false;

        this.sendToExistingConversation();
      },
      error: () => {
        this.creatingConversation = false;
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
    setTimeout(() => this.scrollToBottom(), 0);

    this._AiService
      .sendMessage(this.conversationId!, content)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.messages.push({
            content: res.reply || res.content,
            role: 'ai',
          });

          this.shouldScroll = true;
        },
        error: () => {
          console.error('AI failed');
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
