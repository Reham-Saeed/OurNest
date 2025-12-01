import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  @Input() pickerType!: 'lastPeriodDate' | 'expectedDate' | 'pregnancy' | 'age';
  @Input() showLabel = true;
  @Input() labelDay = 'days';
  @Input() labelWeek = 'weeks';

  @Output() dateSelected = new EventEmitter<any>();

  days: number[] = [];
  months: string[] = [];
  years: number[] = [];
  weeks: number[] = [];

  selectedDay!: number;
  selectedMonth!: string;
  selectedYear!: number;
  selectedWeek!: number;

  itemHeight = 40;
  spacer = this.itemHeight * 2;

  currentYear = new Date().getFullYear();

  private initDatePicker(startYear: number, yearCount: number = 1) {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    this.months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('en', { month: 'long' })
    );
    this.years = Array.from({ length: yearCount }, (_, i) => startYear + i);

    this.selectedDay = this.days[0];
    this.selectedMonth = this.months[0];
    this.selectedYear = this.years[0];
  }

  private initPregnancyPicker() {
    this.weeks = Array.from({ length: 42 }, (_, i) => i);
    this.days = Array.from({ length: 7 }, (_, i) => i);

    this.selectedWeek = this.weeks[0];
    this.selectedDay = this.days[0];
  }

  private initAgePicker() {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    this.months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('en', { month: 'long' })
    );

    const minAge = 16;
    const maxAge = 60;
    const currentYear = new Date().getFullYear();

    const minYear = currentYear - maxAge;
    const maxYear = currentYear - minAge;
    this.years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    this.selectedDay = this.days[0];
    this.selectedMonth = this.months[0];
    this.selectedYear = this.years[0];
  }

  scrollTimeout: any;
  onScroll(type: string, element: HTMLElement, array: any[], key: string) {
    clearTimeout(this.scrollTimeout);
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / this.itemHeight);

    (this as any)[key] = array[index] ?? array[0];

    this.dateSelected.emit(this.getCurrentValue());
    this.scrollTimeout = setTimeout(() => this.snapToCenter(element, index), 120);
  }

  snapToCenter(element: HTMLElement, index: number) {
    element.scrollTo({ top: index * this.itemHeight, behavior: 'smooth' });
  }

  getCurrentValue() {
    switch (this.pickerType) {
      case 'lastPeriodDate':
        return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
      case 'expectedDate':
        return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
      case 'pregnancy':
        return { week: this.selectedWeek, day: this.selectedDay };
      case 'age':
        return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
    }
  }

  isSelected(type: string, value: any) {
    switch (type) {
      case 'day':
        return value === this.selectedDay;
      case 'month':
        return value === this.selectedMonth;
      case 'year':
        return value === this.selectedYear;
      case 'week':
        return value === this.selectedWeek;
    }
    return false;
  }

  ngOnInit() {
    switch (this.pickerType) {
      case 'lastPeriodDate':
        this.initDatePicker(this.currentYear - 1, 2);
        break;

      case 'expectedDate':
        this.initDatePicker(this.currentYear, 2);
        break;

      case 'pregnancy':
        this.initPregnancyPicker();
        break;

      case 'age':
        this.initAgePicker();
        break;
    }
  }
}
