import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PeriodTrackerService, PeriodPredictions } from '../../core/services/trackers/period-tracker.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracker.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss',
})
export class TrackerComponent {
 private periodService = inject(PeriodTrackerService);

  currentMonth = '';
  days: any[] = [];

  // Dynamic Cycle Variables
  cycleLength = 28; // Default, will update from backend
  currentDayIndex = 1; // Where the knob is
  daysUntilNextPeriod = 0;
  pregnancyChance = 'Low chance of getting pregnant';

  showAddPeriodModal = false;
  newPeriod = {
    startDate: '',
    endDate: '',
    flowIntensity: 'Medium',
    symptoms: '',
    notes: '',
  };

  ngOnInit() {
    this.loadCycleData();
  }

  loadCycleData() {
    forkJoin({
      history: this.periodService.getPeriods(),
      predictions: this.periodService.getPredictions(),
    }).subscribe({
      next: (data) => {
        const latestPeriod =
          data.history.length > 0
            ? data.history[data.history.length - 1]
            : { startDate: new Date().toISOString(), cycleLengthDays: 28 };

        this.cycleLength = latestPeriod.cycleLengthDays || 28;

        const cycleStart = new Date(latestPeriod.startDate);
        this.currentMonth = cycleStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        const today = new Date();
        const diffTime = Math.abs(today.getTime() - cycleStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.currentDayIndex = diffDays <= this.cycleLength ? diffDays : this.cycleLength;

        const nextPeriodStart = new Date(data.predictions.nextPeriodStart);
        const timeToNext = nextPeriodStart.getTime() - today.getTime();
        this.daysUntilNextPeriod = Math.max(0, Math.ceil(timeToNext / (1000 * 60 * 60 * 24)));

        this.generateCircleDays(cycleStart, data.predictions);
      },
      error: (err) => {
        console.warn('Backend failed! Drawing dynamic fallback circle. Error:', err.message);

        const today = new Date();
        const fallbackCycleLength = 28;
        const assumedCurrentDay = 14;

        const mockStart = new Date(today);
        mockStart.setDate(today.getDate() - (assumedCurrentDay - 1));

        this.cycleLength = fallbackCycleLength;
        this.currentDayIndex = assumedCurrentDay;
        this.daysUntilNextPeriod = fallbackCycleLength - assumedCurrentDay;
        this.pregnancyChance = 'High chance of getting pregnant';
        this.currentMonth = mockStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        const nextStart = new Date(mockStart);
        nextStart.setDate(mockStart.getDate() + fallbackCycleLength);

        const nextEnd = new Date(nextStart);
        nextEnd.setDate(nextStart.getDate() + 5);

        const fertStart = new Date(mockStart);
        fertStart.setDate(mockStart.getDate() + 11);

        const fertEnd = new Date(mockStart);
        fertEnd.setDate(mockStart.getDate() + 17);

        const ovulation = new Date(mockStart);
        ovulation.setDate(mockStart.getDate() + 13);
        const mockPredictions: PeriodPredictions = {
          nextPeriodStart: nextStart.toISOString(),
          nextPeriodEnd: nextEnd.toISOString(),
          fertilityWindowStart: fertStart.toISOString(),
          fertilityWindowEnd: fertEnd.toISOString(),
          ovulationDate: ovulation.toISOString(),
        };

        this.generateCircleDays(mockStart, mockPredictions);
      },
    });
  }

  generateCircleDays(cycleStart: Date, predictions: PeriodPredictions) {
    this.days = [];
    const radius = 175;

    const nextStart = new Date(predictions.nextPeriodStart).setHours(0, 0, 0, 0);
    const nextEnd = new Date(predictions.nextPeriodEnd).setHours(0, 0, 0, 0);
    const fertStart = new Date(predictions.fertilityWindowStart).setHours(0, 0, 0, 0);
    const fertEnd = new Date(predictions.fertilityWindowEnd).setHours(0, 0, 0, 0);
    const ovulation = new Date(predictions.ovulationDate).setHours(0, 0, 0, 0);

    for (let i = 1; i <= this.cycleLength; i++) {
      const angle = ((i - 1) / this.cycleLength) * 360 - 90;

      let textClass = 'text-gray-800 font-medium text-lg';
      let wrapperClass = 'w-10 h-10 flex items-center justify-center rounded-full';

      const dayDate = new Date(cycleStart);
      dayDate.setDate(cycleStart.getDate() + (i - 1));
      const dayTime = dayDate.setHours(0, 0, 0, 0);

      if (dayTime >= nextStart && dayTime <= nextEnd) {
        textClass = 'text-[#c06b7a] font-medium text-lg';
      } else if (dayTime >= fertStart && dayTime <= fertEnd && dayTime !== ovulation) {
        textClass = 'text-teal-400 font-medium text-lg';
        if (i === this.currentDayIndex) {
          this.pregnancyChance = 'High chance of getting pregnant';
        }
      } else if (dayTime === ovulation) {
        textClass = 'text-green-500 font-bold text-lg';
        wrapperClass += ' border border-dashed border-green-500';
      }

      this.days.push({
        value: i,
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
        textClass,
        wrapperClass,
      });
    }
  }

  get dynamicRingBackground() {
    const deg = ((this.currentDayIndex - 1) / this.cycleLength) * 360;
    return `conic-gradient(from 0deg, rgba(46, 116, 112, 1) 0deg, rgba(45,212,191,1) ${deg}deg, transparent ${deg}deg)`;
  }

  get knobTransform() {
    const angle = ((this.currentDayIndex - 1) / this.cycleLength) * 360 - 90;
    return `rotate(${angle}deg) translate(137px)`;
  }

  openAddPeriodModal() {
    const today = new Date().toISOString().split('T')[0];
    this.newPeriod = {
      startDate: today,
      endDate: today,
      flowIntensity: 'Medium',
      symptoms: '',
      notes: '',
    };
    this.showAddPeriodModal = true;
  }

  closeAddPeriodModal() {
    this.showAddPeriodModal = false;
  }

  submitNewPeriod() {
    const start = new Date(this.newPeriod.startDate);
    const end = new Date(this.newPeriod.endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const periodLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const payload = {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      cycleLengthDays: this.cycleLength || 28,
      periodLengthDays: periodLength,
      flowIntensity: this.newPeriod.flowIntensity,
      symptoms: this.newPeriod.symptoms,
      notes: this.newPeriod.notes,
    };

    this.periodService.addPeriod(payload).subscribe({
      next: () => {
        this.closeAddPeriodModal();
        this.loadCycleData();
      },
      error: (err) => console.error('Error adding period', err),
    });
  }

  prevMonth() {}
  nextMonth() {}
}
