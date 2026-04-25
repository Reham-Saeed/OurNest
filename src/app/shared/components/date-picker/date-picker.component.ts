import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  @Input() pickerType!:
    | 'lastPeriodDate'
    | 'expectedDate'
    | 'pregnancy'
    | 'age'
    | 'babyAge'
    | 'time';
  @Input() showLabel = true;
  @Input() labelDay = 'days';
  @Input() labelWeek = 'weeks';

  @Output() dateSelected = new EventEmitter<any>();

  days: number[] = [];
  months: string[] = [];
  years: number[] = [];
  weeks: number[] = [];

  hours: number[] = [];
  minutes: string[] = [];
  periods: string[] = ['AM', 'PM'];

  selectedDay!: number;
  selectedMonth!: string;
  selectedYear!: number;
  selectedWeek!: number;

  selectedHour!: number;
  selectedMinute!: string;
  selectedPeriod!: string;

  itemHeight = 40;
  spacer = this.itemHeight * 2;

  currentYear = new Date().getFullYear();

  restrictPastDates = false;
  restrictFutureDates = false;

  private initDatePicker(
    startYear: number,
    yearCount: number = 1,
    useCurrentDate: boolean = false,
  ) {
    this.restrictPastDates = useCurrentDate;

    const now = new Date();
    this.years = Array.from({ length: yearCount }, (_, i) => startYear + i);

    if (useCurrentDate) {
      this.selectedYear = this.years.includes(now.getFullYear())
        ? now.getFullYear()
        : this.years[0];
      const allMonths = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      this.selectedMonth = allMonths[now.getMonth()];
      this.selectedDay = now.getDate();
    } else {
      this.days = Array.from({ length: 31 }, (_, i) => i + 1);
      this.months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      this.selectedYear = this.years[0];
      this.selectedMonth = this.months[0];
      this.selectedDay = this.days[0];
    }

    this.updateDateBoundaries();
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
      new Date(0, i).toLocaleString('en', { month: 'long' }),
    );

    const minAge = 20;
    const maxAge = 40;
    const currentYear = new Date().getFullYear();

    const minYear = currentYear - maxAge;
    const maxYear = currentYear - minAge;
    this.years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

    this.selectedDay = this.days[0];
    this.selectedMonth = this.months[0];
    this.selectedYear = this.years[0];
  }

  private initBabyAgePicker() {
    this.restrictPastDates = false;
    this.restrictFutureDates = true;

    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    this.months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('en', { month: 'long' }),
    );

    const maxBabyAge = 2;
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - maxBabyAge;

    this.years = Array.from({ length: maxBabyAge + 1 }, (_, i) => minYear + i);

    this.selectedYear = currentYear;

    this.updateDateBoundaries();
  }

  private initTimePicker() {
    this.hours = Array.from({ length: 12 }, (_, i) => i + 1);
    this.minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`));

    const now = new Date();
    let currentHour = now.getHours();

    this.selectedPeriod = currentHour >= 12 ? 'PM' : 'AM';

    currentHour = currentHour % 12 || 12;
    this.selectedHour = currentHour;

    this.selectedMinute = this.minutes[now.getMinutes()];
  }

  scrollTimeout: any;
  onScroll(type: string, element: HTMLElement, array: any[], key: string) {
    clearTimeout(this.scrollTimeout);
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / this.itemHeight);

    (this as any)[key] = array[index] ?? array[0];

    if (type === 'year' || type === 'month') {
      this.updateDateBoundaries();
    }

    this.dateSelected.emit(this.getCurrentValue());

    const freshArray =
      type === 'day' ? this.days : type === 'month' ? this.months : (this as any)[type + 's'];
    const newIndex = freshArray ? freshArray.indexOf((this as any)[key]) : 0;

    this.scrollTimeout = setTimeout(
      () => this.snapToCenter(element, newIndex !== -1 ? newIndex : 0),
      120,
    );
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
      case 'babyAge':
        return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
      case 'time':
        return {
          hour: this.selectedHour,
          minute: this.selectedMinute,
          period: this.selectedPeriod,
        };
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
      case 'hour':
        return value === this.selectedHour;
      case 'minute':
        return value === this.selectedMinute;
      case 'period':
        return value === this.selectedPeriod;
    }
    return false;
  }

  ngOnInit() {
    switch (this.pickerType) {
      case 'lastPeriodDate':
        this.initDatePicker(this.currentYear - 1, 2, false);
        this.restrictFutureDates = true;
        break;

      case 'expectedDate':
        this.initDatePicker(this.currentYear, 2, true);
        break;

      case 'pregnancy':
        this.initPregnancyPicker();
        break;

      case 'age':
        this.initAgePicker();
        break;

      case 'babyAge':
        this.initBabyAgePicker();
        break;

      case 'time':
        this.initTimePicker();
        break;
    }
  }

  updateDateBoundaries() {
    if (!this.restrictPastDates && !this.restrictFutureDates) return;

    const now = new Date();
    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (this.restrictPastDates && this.selectedYear === now.getFullYear()) {
      this.months = allMonths.slice(now.getMonth());
    } else if (this.restrictFutureDates && this.selectedYear === now.getFullYear()) {
      this.months = allMonths.slice(0, now.getMonth() + 1);
    } else {
      this.months = allMonths;
    }

    if (!this.months.includes(this.selectedMonth)) {
      this.selectedMonth = this.restrictFutureDates
        ? this.months[this.months.length - 1]
        : this.months[0];
    }

    const monthIndex = allMonths.indexOf(this.selectedMonth);
    const totalDaysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();

    let startDay = 1;
    let endDay = totalDaysInMonth;

    // Block past days (Pregnancy expected date)
    if (
      this.restrictPastDates &&
      this.selectedYear === now.getFullYear() &&
      monthIndex === now.getMonth()
    ) {
      startDay = now.getDate();
    }

    // Block future days (Baby birth date)
    if (
      this.restrictFutureDates &&
      this.selectedYear === now.getFullYear() &&
      monthIndex === now.getMonth()
    ) {
      endDay = now.getDate();
    }

    this.days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);

    // Ensure selected day isn't out of bounds
    if (!this.days.includes(this.selectedDay)) {
      this.selectedDay = this.restrictFutureDates ? this.days[this.days.length - 1] : this.days[0];
    }
  }
}
