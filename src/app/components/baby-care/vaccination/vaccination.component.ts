import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { BabyService } from '../../../core/services/baby/baby.service';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './vaccination.component.html',
})
export class VaccinationComponent implements OnInit {
  private babyService = inject(BabyService);
  private babyCareService = inject(BabyCareService);

  babyName = 'Loading...';
  babyMonth = 1;
  babyWeight = '--';
  babyLength = '--';

  showModal = false;
  showPicker = false;

  newVaccineName = '';
  lastVaccineDateDisplay = '';
  lastVaccineDateObj: any = null;

  dailyNeeds: any[] = [];
  vaccinationSchedule: any[] = [];

  ngOnInit() {
    this.loadBabyAndCareData();
  }

  loadBabyAndCareData() {
    this.babyService.getAllBabies().subscribe({
      next: (babies) => {
        if (babies && babies.length > 0) {
          const baby = babies[0];
          
          this.babyName = baby.name || 'Baby';
          this.babyWeight = baby.birthWeight ? `${baby.birthWeight} kg` : '-- kg';
          this.babyLength = baby.birthHeight ? `${baby.birthHeight} cm` : '-- cm';
          
          const dob = new Date(baby.dateOfBirth);
          const diffDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
          this.babyMonth = Math.max(1, Math.floor(diffDays / 30));

          this.fetchVaccinations(this.babyMonth);
        } else {
          this.applyBabyFallback();
          this.applyScheduleFallback();
        }
      },
      error: (err) => {
        console.error('Failed to load baby profile', err);
        this.applyBabyFallback();
        this.applyScheduleFallback();
      }
    });
  }

  fetchVaccinations(month: number) {
    this.babyCareService.getVaccinations(month).subscribe({
      next: (res) => {
        this.dailyNeeds = res.dailyNeeds || this.getFallbackNeeds();
        this.vaccinationSchedule = res.vaccinations.map((vac: any) => ({ 
          name: vac.name, 
          status: vac.status || 'Scheduled', 
          isNew: false 
        }));
      },
      error: (err) => {
        console.warn('Backend returned 404 for vaccinations. Applying Schedule Fallback!', err.message);
        this.applyScheduleFallback();
      }
    });
  }

  applyBabyFallback() {
    this.babyName = 'Mariam';
    this.babyMonth = 2;
    this.babyWeight = '4.8 kg';
    this.babyLength = '57 cm';
  }

  applyScheduleFallback() {
    this.dailyNeeds = this.getFallbackNeeds();
    this.vaccinationSchedule = [
      { name: 'Hepatitis B (Dose 2)', status: 'Scheduled', isNew: false },
      { name: 'Rotavirus (RV)', status: 'Scheduled', isNew: false },
      { name: 'DTaP', status: 'Scheduled', isNew: false },
      { name: 'Pneumococcal', status: 'Scheduled', isNew: false },
      { name: 'Polio (IPV)', status: 'Scheduled', isNew: false }
    ];
  }

  getFallbackNeeds() {
    return [
      { icon: 'assets/baby-bottle.svg', label: 'Number Of Feedings', value: '6–8 Per Day', bgColor: 'bg-pink-100' },
      { icon: 'assets/diaper.svg', label: 'Number Of Wet Diapers', value: '6+ Per Day', bgColor: 'bg-blue-100' },
      { icon: 'assets/weight.svg', label: 'Weight Gain Rate', value: '150–200 Gm/Week', bgColor: 'bg-green-100' },
      { icon: 'assets/calender.svg', label: 'Next Vaccinations', value: 'End Of Month 2', bgColor: 'bg-red-100' },
    ];
  }



  togglePicker() { this.showPicker = !this.showPicker; }
  openModal() { this.showModal = true; }
  
  closeModal() {
    this.showModal = false;
    this.showPicker = false;
    this.newVaccineName = '';
    this.lastVaccineDateDisplay = '';
    this.lastVaccineDateObj = null;
  }

  onDateChange(val: any) {
    this.lastVaccineDateObj = val;
    this.lastVaccineDateDisplay = `${val.month} ${val.day}, ${val.year}`;
  }

  saveVaccination() {
    if (!this.lastVaccineDateDisplay || !this.newVaccineName) return;

    this.vaccinationSchedule.unshift({
      name: this.newVaccineName,
      status: `Given: ${this.lastVaccineDateDisplay}`,
      isNew: true,
    });

    this.closeModal();
  }
}