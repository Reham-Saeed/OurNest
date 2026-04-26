import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PeriodTrackerService, PeriodPredictions } from '../../core/services/trackers/period-tracker.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tracker.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss',
})
export class TrackerComponent implements OnInit {
  private periodService = inject(PeriodTrackerService);

  currentMonth = '';
  days: any[] = [];

  allPeriods: any[] = [];
  viewIndex: number = 0;
  predictions: PeriodPredictions | null = null;
  isViewingCurrent: boolean = true;

  cycleLength = 28; 
  currentDayIndex = 1; 
  daysUntilNextPeriod = 0;
  pregnancyChance = 'Low chance of getting pregnant';

  showAddPeriodModal = false;
  newPeriod = { startDate: '', endDate: '', flowIntensity: 'Medium', symptoms: '', notes: '' };

  ngOnInit() {
    this.loadCycleData();
  }

  loadCycleData() {
    forkJoin({
      history: this.periodService.getPeriods(),
      predictions: this.periodService.getPredictions(),
    }).subscribe({
      next: (data) => {
        this.predictions = data.predictions;
        
        this.allPeriods = data.history.sort((a: any, b: any) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        if (this.allPeriods.length === 0) {
          this.allPeriods = [{ startDate: new Date().toISOString(), cycleLengthDays: 28, periodLengthDays: 5 }];
        }

        this.viewIndex = this.allPeriods.length - 1;
        this.updateUIForSelectedCycle();
      },
      error: (err) => {
        console.warn('Backend failed! Drawing dynamic fallback circle.', err);
        this.drawFallbackCircle();
      },
    });
  }

  updateUIForSelectedCycle() {
    const activePeriod = this.allPeriods[this.viewIndex];
    
    this.isViewingCurrent = (this.viewIndex === this.allPeriods.length - 1);

    this.cycleLength = this.predictions?.averageCycle || activePeriod.cycleLengthDays || 28;

    const cycleStart = new Date(activePeriod.startDate);
    this.currentMonth = cycleStart.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (this.isViewingCurrent) {
      const todayTime = new Date().setHours(0, 0, 0, 0);
      const cycleStartTime = new Date(activePeriod.startDate).setHours(0, 0, 0, 0);
      const diffDays = Math.round((todayTime - cycleStartTime) / (1000 * 60 * 60 * 24)) + 1;
      this.currentDayIndex = Math.max(1, Math.min(diffDays, this.cycleLength));
    } else {
      this.currentDayIndex = 0; 
    }

    const nextPeriodStart = new Date(cycleStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + this.cycleLength);

    if (this.isViewingCurrent) {
      const timeToNext = nextPeriodStart.getTime() - new Date().getTime();
      this.daysUntilNextPeriod = Math.max(0, Math.ceil(timeToNext / (1000 * 60 * 60 * 24)));
      this.pregnancyChance = 'Low chance of getting pregnant';
    } else {
      this.daysUntilNextPeriod = 0; 
      this.pregnancyChance = 'Cycle Completed';
    }

    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertStart = new Date(ovulationDate);
    fertStart.setDate(fertStart.getDate() - 5);

    const fertEnd = new Date(ovulationDate);
    fertEnd.setDate(fertEnd.getDate() + 1);

    this.generateCircleDays(cycleStart, ovulationDate, fertStart, fertEnd, activePeriod);
  }

  prevMonth() {
    if (this.viewIndex > 0) {
      this.viewIndex--; 
      this.updateUIForSelectedCycle();
    }
  }

  nextMonth() {
    if (this.viewIndex < this.allPeriods.length - 1) {
      this.viewIndex++;
      this.updateUIForSelectedCycle();
    }
  }

  generateCircleDays(cycleStart: Date, ovulationDate: Date, fertStart: Date, fertEnd: Date, latestPeriod: any) {
    this.days = [];
    const radius = 175;

    const currentPeriodStart = new Date(latestPeriod.startDate).setHours(0, 0, 0, 0);
    
    const pLength = latestPeriod.periodLengthDays > 0 ? latestPeriod.periodLengthDays : 5; 
    const calculatedEnd = new Date(latestPeriod.startDate);
    calculatedEnd.setDate(calculatedEnd.getDate() + (pLength - 1));
    const currentPeriodEnd = calculatedEnd.setHours(0, 0, 0, 0);

    const fStart = fertStart.setHours(0, 0, 0, 0);
    const fEnd = fertEnd.setHours(0, 0, 0, 0);
    const ov = ovulationDate.setHours(0, 0, 0, 0);

    const medFertStart = new Date(fertStart);
    medFertStart.setDate(medFertStart.getDate() - 2);
    const mStart = medFertStart.setHours(0, 0, 0, 0);

    for (let i = 1; i <= this.cycleLength; i++) {
      const angle = ((i - 1) / this.cycleLength) * 360 - 90;

      let textClass = 'text-gray-400 font-medium text-lg'; 
      let wrapperClass = 'w-10 h-10 flex items-center justify-center rounded-full';

      const dayDate = new Date(cycleStart);
      dayDate.setDate(cycleStart.getDate() + (i - 1));
      const dayTime = dayDate.setHours(0, 0, 0, 0);

      if (dayTime >= currentPeriodStart && dayTime <= currentPeriodEnd) {
        textClass = 'text-[#c06b7a] font-bold text-xl'; 
      } else if (dayTime === ov) {
        textClass = 'text-green-500 font-bold text-xl'; 
        wrapperClass += ' border-2 border-dashed border-green-500';
        if (i === this.currentDayIndex) this.pregnancyChance = 'Peak chance of getting pregnant!';
      } else if (dayTime >= fStart && dayTime <= fEnd) {
        textClass = 'text-teal-400 font-bold text-xl'; 
        if (i === this.currentDayIndex) this.pregnancyChance = 'High chance of getting pregnant';
      } else if (dayTime >= mStart && dayTime < fStart) {
        textClass = 'text-gray-700 font-bold text-lg'; 
        if (i === this.currentDayIndex) this.pregnancyChance = 'Medium chance of getting pregnant';
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
    if (!this.isViewingCurrent || this.currentDayIndex === 0) return 'transparent'; 
    
    const deg = ((this.currentDayIndex - 1) / this.cycleLength) * 360;
    return `conic-gradient(from 0deg, rgba(46, 116, 112, 1) 0deg, rgba(45,212,191,1) ${deg}deg, transparent ${deg}deg)`;
  }

  get knobTransform() {
    if (!this.isViewingCurrent || this.currentDayIndex === 0) return `scale(0)`; 
    
    const angle = ((this.currentDayIndex - 1) / this.cycleLength) * 360 - 90;
    return `rotate(${angle}deg) translate(137px)`;
  }

  openAddPeriodModal() {
    const today = new Date().toISOString().split('T')[0];
    this.newPeriod = { startDate: today, endDate: today, flowIntensity: 'Medium', symptoms: '', notes: '' };
    this.showAddPeriodModal = true;
  }

  closeAddPeriodModal() { this.showAddPeriodModal = false; }

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



  private drawFallbackCircle() {
    const today = new Date();
    this.cycleLength = 28;
    this.currentDayIndex = 14;
    this.daysUntilNextPeriod = 14;
    this.pregnancyChance = 'High chance of getting pregnant';

    const mockStart = new Date(today);
    mockStart.setDate(today.getDate() - 13);
    this.currentMonth = mockStart.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const ovulation = new Date(mockStart); ovulation.setDate(mockStart.getDate() + 14);
    const fStart = new Date(ovulation); fStart.setDate(ovulation.getDate() - 5);
    const fEnd = new Date(ovulation); fEnd.setDate(ovulation.getDate() + 1);
    
    const fakeLatest = { startDate: mockStart.toISOString(), endDate: new Date(mockStart.getTime() + 4*24*60*60*1000).toISOString() };

    this.generateCircleDays(mockStart, ovulation, fStart, fEnd, fakeLatest);
  }
}