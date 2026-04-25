import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BabyService } from '../../core/services/baby/baby.service';
import { PartnerService } from '../../core/services/partner/partner.service';

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
  private _PartnerService = inject(PartnerService);

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
    { title: 'Feeding Guid', image: 'assets/feeding-time.jpg', route: 'feeding-guid' },
    { title: 'Baby Vitamins', image: 'assets/baby-feeding.jpg', route: 'vitamins' },
    { title: 'Baby Vaccination', image: 'assets/baby-vaccination.jpg', route: 'vaccination' },
  ];

  ngOnInit() {
    this.loadBabyData();
  }

  loadBabyData() {
    this._PartnerService.getFamilyDashboard().subscribe({
      next: (res) => {
        const babies = res?.babyData?.babies ?? [];

        const baby = babies.length > 0 ? babies[0] : null;

        if (baby) {
          localStorage.setItem('babyId', baby.id);

          this.calculateTimeline(baby.dateOfBirth);
          this.babyWeight = `${baby.birthWeight || 0} kg`;
        } else {
          this.calculateTimeline(new Date().toISOString());
          this.babyAge = 'No baby found';
        }
      },

      error: (err) => {
        console.error('Failed to load baby data', err);

        this.calculateTimeline(
          new Date(new Date().setDate(new Date().getDate() - 65)).toISOString(),
        );
      },
    });
  }

  calculateTimeline(dobString: string) {
    const dob = new Date(dobString);
    const today = new Date();

    const diffTime = Math.abs(today.getTime() - dob.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    this.currentWeek = Math.floor(diffDays / 7) + 1;
    this.selectedWeek = this.currentWeek;

    this.pastWeeks = [this.currentWeek - 3, this.currentWeek - 2, this.currentWeek - 1].filter(
      (w) => w > 0,
    );
    this.futureWeeks = [this.currentWeek + 1, this.currentWeek + 2, this.currentWeek + 3];

    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    let ageText = '';
    if (months > 0) ageText += `${months} month${months > 1 ? 's' : ''}\n`;
    if (days > 0 || months === 0) ageText += `${days} day${days !== 1 ? 's' : ''}`;

    this.babyAge = ageText.trim();
  }


  get currentArticles(): Article[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.allArticles.slice(start, start + this.itemsPerPage);
  }

}
