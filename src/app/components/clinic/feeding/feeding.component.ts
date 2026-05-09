import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';

@Component({
  selector: 'app-feeding',
  templateUrl: './feeding.component.html',
  styleUrl: './feeding.component.scss',
})
export class FeedingComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  selectedFile!: File;
  messages: any[] = [];
  loading = false;

  private shouldScroll = false;

  constructor(private _AiService: AiService) {}

  ngOnInit() {
    const saved = localStorage.getItem('feeding_chat');
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
    localStorage.setItem('feeding_chat', JSON.stringify(this.messages));
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

    this.analyzeFood();
  }

  analyzeFood() {
    if (!this.selectedFile) return;

    this.loading = true;

    this._AiService.analyzeFood(this.selectedFile).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.messages.push({
          type: 'bot',
          data: res,
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
}
