import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine',
  imports: [CommonModule],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.scss',
})
export class MedicineComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  selectedFile!: File;
  messages: any[] = [];
  loading = false;

  private shouldScroll = false;

  constructor(private _AiService: AiService) {}

  ngOnInit() {
    const saved = localStorage.getItem('medicine_chat');
    if (saved) {
      this.messages = JSON.parse(saved);
      this.shouldScroll = true;
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTo({
        top: this.chatContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch {}
  }

  saveMessages() {
    localStorage.setItem('medicine_chat', JSON.stringify(this.messages));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result as string;
      this.messages.push({
        type: 'user',
        image: image,
      });

      this.saveMessages();
      this.shouldScroll = true;
      setTimeout(() => this.scrollToBottom(), 0);
    };
    reader.readAsDataURL(file);

    this.analyzeMedicine();
  }

  analyzeMedicine() {
    if (!this.selectedFile) return;

    this.loading = true;

    this._AiService.analyzeMedicine(this.selectedFile).subscribe({
      next: (res: any) => {
        this.loading = false;
        const parsed = this.parseMedicine(res.formatted_text);
        this.messages.push({
          type: 'bot',
          data: parsed,
        });
        this.saveMessages();
        this.shouldScroll = true;
      },
      error: () => {
        this.loading = false;
        this.messages.push({
          type: 'bot',
          data: null,
          errorMessage: 'Something went wrong. Please try again later.',
        });
         this.saveMessages();
        this.shouldScroll = true;
      },
    });
  }

  parseMedicine(content: string) {
    const result: any[] = [];

    const items = content.split('-').slice(1);

    items.forEach((item) => {
      const lines = item
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const name = lines[0].replace(':', '');

      const obj: any = { name };

      lines.forEach((line) => {
        if (line.startsWith('Reason for caution'))
          obj.reason = line.replace('Reason for caution:', '').trim();

        if (line.startsWith('Potential risks'))
          obj.risks = line.replace('Potential risks:', '').trim();

        if (line.startsWith('Advice/Solution'))
          obj.advice = line.replace('Advice/Solution:', '').trim();
      });

      result.push(obj);
    });

    return result;
  }

  formatMedicineText(content: string) {
    if (!content) return '';

    let lines = content.split('\n');

    lines = lines.map((line) => {
      if (line.trim().startsWith('-') || line.trim().startsWith('🧪')) {
        return `<strong>${line}</strong>`;
      }
      return line;
    });

    return lines.join('<br>');
  }
}
