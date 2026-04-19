import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { BabyService } from '../../../core/services/baby/baby.service';
import { BabyCareService } from '../../../core/services/baby-care/baby-care.service';

@Component({
  selector: 'app-feeding-time',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './feeding-time.component.html',
  styleUrl: './feeding-time.component.scss',
})
export class FeedingTimeComponent implements OnInit {
  private babyService = inject(BabyService);
  private babyCareService = inject(BabyCareService);

  babyName = 'Loading...';
  babyMonth = 1;
  babyWeight = '--';
  babyLength = '--';

  showModal = false;
  lastFeedingTime: any = ''; 
  lastFeedingTimeDisplay = '';
  showPicker = false;
  
  // Validation State
  isTimeValid = false;
  timeWarningMessage = '';

  dailyNeeds: any[] = [];
  feedingSchedule: any[] = [];

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

          this.fetchFeedingGuide(this.babyMonth);
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

  fetchFeedingGuide(month: number) {
    this.babyCareService.getFeedingGuide(month).subscribe({
      next: (res) => {
        this.dailyNeeds = res.dailyNeeds;
        this.feedingSchedule = res.feedingSchedule.map((time: string) => ({ time, isNew: false }));
      },
      error: (err) => {
        console.warn('Backend returned 404 for feeding data. Applying Fallback!', err.message);
        this.applyFallbackData();
      }
    });
  }

  applyFallbackData() {


    this.dailyNeeds = [
      { icon: 'assets/baby-bottle.svg', label: 'Number Of Feedings', value: '6–8 Per Day', bgColor: 'bg-pink-100' },
      { icon: 'assets/diaper.svg', label: 'Number Of Wet Diapers', value: '6+ Per Day', bgColor: 'bg-blue-100' },
      { icon: 'assets/weight.svg', label: 'Weight Gain Rate', value: '150–200 Gm/Week', bgColor: 'bg-green-100' },
      { icon: 'assets/calender.svg', label: 'Next Vaccinations', value: 'End Of Month 2', bgColor: 'bg-red-100' },
    ];

    this.feedingSchedule = [
      { time: '6:30 AM', isNew: false }, { time: '9:30 AM', isNew: false },
      { time: '12:30 PM', isNew: false }, { time: '3:30 PM', isNew: false },
      { time: '6:30 PM', isNew: false }, { time: '9:30 PM', isNew: false },
      { time: '12:30 AM', isNew: false },
    ];
  }


  togglePicker() {
    this.showPicker = !this.showPicker;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showPicker = false;
    this.timeWarningMessage = '';
  }

  onTimeChange(val: any) {
    const t = this.normalizeTime(val);
    this.lastFeedingTime = t; 
    
    this.checkTimeValidation(t); 
  }

  checkTimeValidation(t: any) {
    const now = new Date();
    let selectedHour24 = t.hour;

    if (t.period === 'PM' && selectedHour24 !== 12) selectedHour24 += 12;
    if (t.period === 'AM' && selectedHour24 === 12) selectedHour24 = 0;

    const selectedTotalMinutes = (selectedHour24 * 60) + Number(t.minute);
    const currentTotalMinutes = (now.getHours() * 60) + now.getMinutes();

    if (selectedTotalMinutes > currentTotalMinutes) {
      const minutesAhead = selectedTotalMinutes - currentTotalMinutes;


      if (minutesAhead >= (12 * 60)) {
        this.timeWarningMessage = ''; 
        this.lastFeedingTimeDisplay = `${this.formatTimeForUI(t)} (Yesterday)`;
        this.isTimeValid = true;
      } else {
        this.timeWarningMessage = 'Cannot log a feeding in the future!';
        this.lastFeedingTimeDisplay = this.formatTimeForUI(t);
        this.isTimeValid = false;
      }
    } else {
      this.timeWarningMessage = '';
      this.lastFeedingTimeDisplay = this.formatTimeForUI(t);
      this.isTimeValid = true;
    }
  }

  private normalizeTime(val: any) {
    if (val.hour && val.period) {
      return val;
    }

    const [h, m] = val.split(':');

    let hour = Number(h);
    const period = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return {
      hour,
      minute: m,
      period,
    };
  }

  saveFeeding() {
    if (!this.lastFeedingTime || !this.isTimeValid) return;

    const formatted = this.lastFeedingTimeDisplay; 

    this.feedingSchedule.push({
      time: formatted,
      isNew: true,
    });

    this.closeModal();
    this.lastFeedingTime = '';
    this.lastFeedingTimeDisplay = '';
  }

  private formatTimeForUI(t: any): string {
    return `${t.hour}:${t.minute} ${t.period}`;
  }

  private toIsoFromTime(time: any): string {
    let hour = time.hour;

    if (time.period === 'PM' && hour !== 12) hour += 12;
    if (time.period === 'AM' && hour === 12) hour = 0;

    const now = new Date();
    now.setHours(hour);
    now.setMinutes(Number(time.minute));

    return now.toISOString();
  }
}