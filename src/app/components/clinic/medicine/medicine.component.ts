import { Component } from '@angular/core';
import { AiService } from '../../../core/services/AI/ai.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine',
  imports: [CommonModule],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.scss',
})
export class MedicineComponent {
  previewImage: string | null = null;
  selectedFile!: File;
  prediction: any;
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

    this.analyzeMedicine();
  }

  analyzeMedicine() {
    if (!this.selectedFile) return;

    this.loading = true;

    this._AiService.analyzeMedicine(this.selectedFile).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.prediction = this.formatMedicineText(res.formatted_text);
        console.log(res);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

formatMedicineText(content: string) {
  if (!content) return '';

  // خلي كل سطر لوحده
  let lines = content.split('\n');

  lines = lines.map(line => {
    // لو السطر بيبدأ بـ -
    if (line.trim().startsWith('-')) {
      return `<strong>${line}</strong>`;
    }

    // لو فيه icon في البداية (زي 🧪)
    if (line.trim().startsWith('🧪')) {
      return `<strong>${line}</strong>`;
    }

    return line;
  });

  // رجعهم مع <br>
  return lines.join('<br>');
}
}
