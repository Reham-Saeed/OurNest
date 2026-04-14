import { routes } from './../../app.routes';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Article {
  title: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-baby-care.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './baby-care.component.html',
  styleUrl: './baby-care.component.scss',
})
export class BabyCareComponent {
  currentWeek = 9;
  selectedWeek = 9;
  babyAge = '2 month 2 days';
  babyWeight = '3.3 kg';

  pastWeeks = [6, 7, 8];
  futureWeeks = [10, 11, 12];

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
