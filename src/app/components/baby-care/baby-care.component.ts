import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BabyService } from '../../core/services/baby/baby.service'; 

interface Article {
  title: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-baby-care', 
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './baby-care.component.html',
  styleUrl: './baby-care.component.scss',
})
export class BabyCareComponent implements OnInit {
  private babyService = inject(BabyService);

  // Dynamic UI Variables
  currentWeek = 1;
  selectedWeek = 1;
  babyAge = 'Loading...';
  babyWeight = '-- kg';

  pastWeeks: number[] = [];
  futureWeeks: number[] = [];

  
  currentPage = 1;
  itemsPerPage = 3;

  allArticles: Article[] = [
    { title: 'Feeding Time', image: 'assets/feeding-time.jpg', route: 'feeding-time' },
    { title: 'Baby Naps', image: 'assets/baby-naps.jpg', route: 'baby-naps' },
    { title: 'Why Babies Cry', image: 'assets/baby-crying.jpg', route: 'baby-crying' },
    { title: 'Baby Temperature', image: 'assets/baby-temperature.jpg', route: 'baby-temperature' },
    { title: 'Feeding Guide', image: 'assets/baby-feeding.jpg', route: 'feeding-guide' },
    { title: 'Vaccination', image: 'assets/baby-vaccination.jpg', route: 'vaccination' },
  ];

  ngOnInit() {
    this.loadBabyData();
  }

  loadBabyData() {
    this.babyService.getAllBabies().subscribe({
      next: (babies) => {
        
        if (babies && babies.length > 0) {
          const baby = babies[0];
          this.calculateTimeline(baby.dateOfBirth);
          this.babyWeight = `${baby.birthWeight || 0} kg`; 
        } else {
          this.calculateTimeline(new Date().toISOString()); 
          this.babyAge = 'No baby found';
        }
      },
      error: (err) => {
        console.error('Failed to load baby data', err);
        this.calculateTimeline(new Date(new Date().setDate(new Date().getDate() - 65)).toISOString());
      }
    });
  }

  calculateTimeline(dobString: string) {
    const dob = new Date(dobString);
    const today = new Date();
    
    const diffTime = Math.abs(today.getTime() - dob.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    this.currentWeek = Math.floor(diffDays / 7) + 1;
    this.selectedWeek = this.currentWeek;

    this.pastWeeks = [this.currentWeek - 3, this.currentWeek - 2, this.currentWeek - 1].filter(w => w > 0);
    this.futureWeeks = [this.currentWeek + 1, this.currentWeek + 2, this.currentWeek + 3];

    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    let ageText = '';
    if (months > 0) ageText += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0 || months === 0) ageText += `${days} day${days !== 1 ? 's' : ''}`;
    
    this.babyAge = ageText.trim();
  }

  // --- UI Methods ---

  get totalPages(): number {
    return Math.ceil(this.allArticles.length / this.itemsPerPage);
  }

  get currentArticles(): Article[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.allArticles.slice(start, start + this.itemsPerPage);
  }

  selectWeek(week: number): void {
    this.selectedWeek = week;
    
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}