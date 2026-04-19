import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { BabyService } from '../../../core/services/baby/baby.service';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';

@Component({
  selector: 'app-feeding-advice',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './feeding-advice.component.html',
})
export class FeedingAdviceComponent implements OnInit {
  private babyService = inject(BabyService);
  private babyCareService = inject(BabyCareService);

  babyName = 'Loading...';
  babyMonth = 1;
  babyWeight = '--';
  babyLength = '--';

  // Modal & Picker State
  showModal = false;
  showPicker = false;

  // New Vitamin Inputs
  newVitaminName = '';
  lastVitaminTimeDisplay = '';
  lastVitaminTimeObj: any = null;

  dailyNeeds: any[] = [];
  vitaminsSchedule: any[] = [];

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

          this.fetchVitamins(this.babyMonth);
        } else {
          this.applyFallbackData();
        }
      },
      error: (err) => {
        console.error('Failed to load baby profile', err);
        this.applyFallbackData();
      }
    });
  }

  fetchVitamins(month: number) {
    this.babyCareService.getVitaminsGuide(month).subscribe({
      next: (res) => {
        this.dailyNeeds = res.dailyNeeds || this.getFallbackNeeds();
        

        this.vitaminsSchedule = res.vitamins.map((vit: any) => ({ 
          name: vit.name, 
          dosage: vit.dosage || 'Daily', 
          isNew: false 
        }));
      },
      error: (err) => {
        console.warn('Backend returned 404 for vitamins. Applying Fallback!', err.message);
        this.applyFallbackData();
      }
    });
  }

  applyFallbackData() {
    this.dailyNeeds = this.getFallbackNeeds();

    this.vitaminsSchedule = [
      { name: 'Vitamin D Drops', dosage: '400 IU / Day', isNew: false },
      { name: 'Iron Supplements', dosage: 'Consult Doctor', isNew: false },
      { name: 'Probiotics', dosage: '5 Drops / Day', isNew: false }
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
    this.newVitaminName = '';
    this.lastVitaminTimeDisplay = '';
    this.lastVitaminTimeObj = null;
  }

  onTimeChange(val: any) {
    this.lastVitaminTimeObj = this.normalizeTime(val);
    this.lastVitaminTimeDisplay = this.formatTimeForUI(this.lastVitaminTimeObj);
  }

  private normalizeTime(val: any) {
    if (val.hour && val.period) return val;
    const [h, m] = val.split(':');
    let hour = Number(h);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return { hour, minute: m, period };
  }

  private formatTimeForUI(t: any): string {
    return `${t.hour}:${t.minute} ${t.period}`;
  }

  saveVitamin() {
    if (!this.lastVitaminTimeDisplay || !this.newVitaminName) return;

    this.vitaminsSchedule.unshift({ 
      name: this.newVitaminName,
      dosage: `Given at ${this.lastVitaminTimeDisplay}`,
      isNew: true,
    });

    this.closeModal();
  }
}