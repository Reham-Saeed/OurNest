import { Component } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-feeding',
  imports: [DecimalPipe],
  templateUrl: './feeding.component.html',
  styleUrl: './feeding.component.scss',
})
export class FeedingComponent {
  previewImage: string | null = null;
  selectedFile!: File;
  predictions: any[] = [];
  loading = false;

  constructor(private _AiService: AiService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.analyzeFood();
  }

  analyzeFood() {
    if (!this.selectedFile) return;

    this.loading = true;

    this._AiService.analyzeImage(this.selectedFile, 'food').subscribe({
      next: (res: any) => {
        this.loading = false;
        this.predictions = res.predictions || [];
        console.log(res);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
