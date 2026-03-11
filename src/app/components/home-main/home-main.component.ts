import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.scss',
})
export class HomeMainComponent {
  currentMonth = 'November 2025';
  days: any[] = [];

  // DYNAMIC CYCLE
  currentDay = 28; // current day
  //liquidFillPercentage = 50;  just a var for later

  ngOnInit() {
    this.generateCircleDays();
  }

  generateCircleDays() {
    const totalDays = 30;
    const radius = 175; // Distance from center

    for (let i = 1; i <= totalDays; i++) {
      const angle = ((i - 1) / totalDays) * 360 - 90;

      let textClass = 'text-gray-800 font-medium text-lg';
      let wrapperClass = 'w-10 h-10 flex items-center justify-center rounded-full';

      // Apply Colors
      if (i >= 8 && i <= 14) {
        textClass = 'text-[#c06b7a] font-medium text-lg'; // Menstrual Pink
      } else if (i >= 19 && i <= 26 && i !== 23) {
        textClass = 'text-teal-400 font-medium text-lg'; // Fertility cyan
      } else if (i === 23) {
        textClass = 'text-green-500 font-bold text-lg';
        wrapperClass += ' border border-dashed border-green-500'; // Peak
      }

      this.days.push({
        value: i,
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
        textClass,
        wrapperClass,
      });
    }
  }

  //fading line color
  get dynamicRingBackground() {
    const deg = ((this.currentDay - 1) / 30) * 360;
    return `conic-gradient(from 0deg, rgba(46, 116, 112, 1) 0deg, rgba(45,212,191,1) ${deg}deg, transparent ${deg}deg)`;
  }

  //knob at the end of circle
  get knobTransform() {
    const angle = ((this.currentDay - 1) / 30) * 360 - 90;
    return `rotate(${angle}deg) translate(137px)`;
  }

  prevMonth() {}
  nextMonth() {}
}
