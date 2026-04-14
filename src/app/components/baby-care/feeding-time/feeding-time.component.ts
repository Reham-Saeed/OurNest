import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-feeding-time.component',
  imports: [CommonModule, FormsModule, DatePickerComponent],
  templateUrl: './feeding-time.component.html',
  styleUrl: './feeding-time.component.scss',
})
export class FeedingTimeComponent {
  babyMonth = 2;
  showModal = false;
  lastFeedingTime = '';
  lastFeedingTimeDisplay = '';

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

  feedingSchedule = [
    { time: '6:30 AM', isNew: false },
    { time: '9:30 AM', isNew: false },
    { time: '12:30 PM', isNew: false },
    { time: '3:30 PM', isNew: false },
    { time: '6:30 PM', isNew: false },
    { time: '9:30 PM', isNew: false },
    { time: '12:30 AM', isNew: false },
  ];
  showPicker = false;

  togglePicker() {
    this.showPicker = !this.showPicker;
  }
  onTimeChange(val: any) {
    const t = this.normalizeTime(val);

    this.lastFeedingTime = t; // object زي reminder system
    this.lastFeedingTimeDisplay = this.formatTimeForUI(t); // للعرض
  }
  private normalizeTime(val: any) {
    // لو جاي object جاهز
    if (val.hour && val.period) {
      return val;
    }

    // لو جاي string "14:30"
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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveFeeding() {
    if (!this.lastFeedingTime) return;

    const formatted = this.formatTimeForUI(this.lastFeedingTime);

    this.feedingSchedule.push({
      time: formatted,
      isNew: true,
    });

    this.showModal = false;
    this.showPicker = false;

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
