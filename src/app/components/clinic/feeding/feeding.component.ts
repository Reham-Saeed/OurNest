import { Component } from '@angular/core';

@Component({
  selector: 'app-feeding',
  imports: [],
  templateUrl: './feeding.component.html',
  styleUrl: './feeding.component.scss',
})
export class FeedingComponent {
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const filePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
