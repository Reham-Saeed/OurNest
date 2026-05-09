import { Component, inject } from '@angular/core';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';
import { BabyService } from '../../../core/services/baby/baby.service';
import { PartnerService } from '../../../core/services/partner/partner.service';

@Component({
  selector: 'app-vitamins.component',
  imports: [],
  templateUrl: './vitamins.component.html',
  styleUrl: './vitamins.component.scss',
})
export class VitaminsComponent {
  private _PartnerService = inject(PartnerService);
  private babyCareService = inject(BabyCareService);

  babyName = '';
  babyMonth = 0;

  vitamins: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._PartnerService.getFamilyDashboard().subscribe({
      next: (res: any) => {
        const baby = res?.babyData?.babies?.[0];

        if (!baby) return;

        this.babyName = baby.name || '';

        const dob = new Date(baby.dateOfBirth);

        const diffDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));

        this.babyMonth = Math.max(0, Math.floor(diffDays / 30));

        this.fetchVitamins(this.babyMonth);
      },

      error: () => {
        this.vitamins = [];
      },
    });
  }

  fetchVitamins(month: number) {
    this.babyCareService.getVitaminsGuide(month).subscribe({
      next: (res) => {
        const vitamins = res?.supplements;

        if (vitamins && vitamins.length > 0) {
          this.vitamins = vitamins.map((v: any) => ({
            name: v.name,
            note: v.note,
            importance: v.importance,
          }));
        } 
      },
      error: () => {
        this.vitamins = [];
      },
    });
  }


  dailyNeeds = [
    {
      icon: 'assets/baby-bottle.svg',
      label: 'Number Of Feedings',
      value: '6–8 Per Day',
      bgColor: 'bg-pink-100',
    },
    {
      icon: 'assets/diaper.svg',
      label: 'Number Of Wet Diapers',
      value: '6+ Per Day',
      bgColor: 'bg-blue-100',
    },
    {
      icon: 'assets/weight.svg',
      label: 'Weight Gain Rate',
      value: '150–200 Gm/Week',
      bgColor: 'bg-green-100',
    },
    {
      icon: 'assets/calender.svg',
      label: 'Next Vaccinations',
      value: 'End Of Month 2',
      bgColor: 'bg-red-100',
    },
  ];
}
