import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';
import { BabyService } from '../../../core/services/baby/baby.service';
import { PartnerService } from '../../../core/services/partner/partner.service';

@Component({
  selector: 'app-feeding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feeding-advice.component.html',
})
export class FeedingAdviceComponent implements OnInit {
  private _PartnerService = inject(PartnerService);
  private babyCareService = inject(BabyCareService);

  babyMonth = 0;
  babyName = '';

  stage: any = null;
  alwaysForbidden: any[] = [];
  chokingHazards: any[] = [];

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

        this.fetchFeeding();
      },
      error: () => {},
    });
  }

  foods: any[] = [];

  allowedFoods: any[] = [];
  forbiddenFoods: any[] = [];
  rows: any[] = [];

  fetchFeeding() {
    this.babyCareService.getFeedingGuide(this.babyMonth).subscribe({
      next: (res) => {
        const stages = res?.ageStages || [];
        if (!stages || stages.length === 0) {
          this.applyFeedingFallback();
          return;
        }

        const parsedStages = stages.map((s: any) => {
          const [min, max] = s.stage.replace(' months', '').split('-').map(Number);

          return {
            ...s,
            min,
            max,
          };
        });

        const validStages = parsedStages.filter((s: any) => this.babyMonth >= s.min);

        const selectedStage = validStages.sort((a: any, b: any) => b.min - a.min)[0];

        this.allowedFoods = selectedStage?.allowedFoods || [];
        this.forbiddenFoods = selectedStage?.forbiddenFoods || [];

        const maxLength = Math.max(this.allowedFoods.length, this.forbiddenFoods.length);

        this.rows = Array.from({ length: maxLength }).map((_, i) => ({
          allowed: this.allowedFoods[i] || null,
          forbidden: this.forbiddenFoods[i] || null,
        }));
      },
      error: () => {
        this.rows = [];
      },
    });
  }

  applyFeedingFallback() {
    this.allowedFoods = [
      {
        name: 'Banana',
        notes: 'Soft and easy to digest',
        frequency: '2–3 times per week',
      },
      {
        name: 'Rice Cereal',
        notes: 'Good first solid food',
        frequency: 'Daily',
      },
      {
        name: 'Mashed Potato',
        notes: 'Rich in carbs',
        frequency: '3–4 times per week',
      },
    ];

    this.forbiddenFoods = [
      {
        name: 'Honey',
        reason: 'Risk of botulism for infants',
      },
      {
        name: 'Whole Nuts',
        reason: 'Choking hazard',
      },
      {
        name: 'Raw Eggs',
        reason: 'Risk of infection',
      },
    ];
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
