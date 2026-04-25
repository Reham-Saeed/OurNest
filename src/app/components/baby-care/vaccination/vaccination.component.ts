import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BabyService } from '../../../core/services/baby/baby.service';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';
import { PartnerService } from '../../../core/services/partner/partner.service';

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vaccination.component.html',
})
export class VaccinationComponent implements OnInit {
  private _PartnerService = inject(PartnerService);
  private babyCareService = inject(BabyCareService);

  babyName = '';
  babyMonth = 0;
  babyWeight = '';
  babyLength = '';

  vaccinationSchedule: any[] = [];

  ngOnInit() {
    this.loadBabyAndCareData();
  }

  loadBabyAndCareData() {
    this._PartnerService.getFamilyDashboard().subscribe({
      next: (res: any) => {
        const baby = res?.babyData?.babies?.[0];

        if (!baby) return;

        this.babyName = baby.name || '';

        const dob = new Date(baby.dateOfBirth);

        const diffDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));

        this.babyMonth = Math.max(0, Math.floor(diffDays / 30));

        this.fetchVaccinations(this.babyMonth);
      },
      error: () => {
        this.vaccinationSchedule = [];
      },
    });
  }

  fetchVaccinations(month: number) {
    this.babyCareService.getVaccinations(month).subscribe({
      next: (res) => {
        const schedule = res?.schedule?.[0];
        const vaccines = schedule?.vaccines;

        if (vaccines && vaccines.length > 0) {
          this.vaccinationSchedule = vaccines.map((v: any) => ({
            name: v.name,
            dose: v.dose,
            reason: v.reason,
          }));
        } else {
          this.applyScheduleFallback();
        }
      },
      error: (err) => {
        console.warn(
          'Backend returned 404 for vaccinations. Applying Schedule Fallback!',
          err.message,
        );
        this.applyScheduleFallback();
      },
    });
  }

  applyScheduleFallback() {
    this.vaccinationSchedule = [
      {
        name: 'Hepatitis B',
        dose: 'Dose 2',
        reason: 'Scheduled',
      },
      {
        name: 'Rotavirus (RV)',
        dose: 'Dose 1',
        reason: 'Scheduled',
      },
      {
        name: 'DTaP',
        dose: 'Dose 3',
        reason: 'Scheduled',
      },
      {
        name: 'Pneumococcal',
        dose: 'Dose 1',
        reason: 'Scheduled',
      },
      {
        name: 'Polio (IPV)',
        dose: 'Dose 2',
        reason: 'Scheduled',
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
