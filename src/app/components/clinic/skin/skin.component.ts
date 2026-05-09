import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-skin',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './skin.component.html',
  styleUrl: './skin.component.scss',
})
export class SkinComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  selectedFile!: File;
  messages: any[] = [];
  loading = false;

  private shouldScroll = false;

  constructor(private _AiService: AiService) {}

  ngOnInit() {
    const saved = localStorage.getItem('skin_chat');
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
    localStorage.setItem('skin_chat', JSON.stringify(this.messages));
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

      setTimeout(() => this.scrollToBottom(), 0);
    };

    reader.readAsDataURL(file);

    this.analyzeSkin();
  }

  analyzeSkin() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.shouldScroll = true;

    this._AiService.analyzeSkin(this.selectedFile).subscribe({
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
