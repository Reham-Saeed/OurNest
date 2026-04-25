import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FeedingComponent } from './feeding/feeding.component';
import { SkinComponent } from './skin/skin.component';
import { MedicineComponent } from './medicine/medicine.component';
import { AiService } from '../../core/services/AI/ai.service';
import { Conversation } from '../../core/interfaces/chatbot';

@Component({
  selector: 'app-clinic',
  imports: [CommonModule, ChatbotComponent, FeedingComponent, SkinComponent, MedicineComponent],
  templateUrl: './clinic.component.html',
  styleUrl: './clinic.component.scss',
})
export class ClinicComponent {
  activeTab: string = 'clinic';
  conversations: Conversation[] = [];
  selectedConversationId: string | null = null;
  newChatKey = 0;

  constructor(private aiService: AiService) {}

  setActive(tab: string) {
    this.activeTab = tab;
  }

  selectConversation(id: string) {
    this.selectedConversationId = id;
  }

onNewChat() {
  this.selectedConversationId = null;
  this.newChatKey = Date.now(); // بدل ++ عشان يضمن reset فعلي
}
  ngOnInit() {
    this.loadConversations();
    this.aiService.refreshConversations$.subscribe(() => {
      this.loadConversations();
    });
  }

  loadConversations() {
    this.aiService.getConversations().subscribe({
      next: (res) => {
        this.conversations = res;
      },
      error: () => console.error('Failed to load conversations'),
    });
  }
}
