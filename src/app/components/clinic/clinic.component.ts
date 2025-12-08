import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FeedingComponent } from './feeding/feeding.component';
import { SkinComponent } from './skin/skin.component';

@Component({
  selector: 'app-clinic',
  imports: [CommonModule, ChatbotComponent, FeedingComponent, SkinComponent],
  templateUrl: './clinic.component.html',
  styleUrl: './clinic.component.scss',
})
export class ClinicComponent {
  questions = [
    'What vitamins or supplements should I take?',
    'When can I feel my baby move?',
    'What foods are safe during pregnancy?',
    'What vitamins or supplements should I take?',
    'When can I feel my baby move?',
    'What foods are safe during pregnancy?',
  ];
  activeTab: string = 'clinic';

  setActive(tab: string) {
    this.activeTab = tab;
  }
}
