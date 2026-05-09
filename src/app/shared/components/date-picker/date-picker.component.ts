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
    | 'lastPeriodPregnancy'
    | 'lastPeriodPlanning'
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

  minDate: Date | null = null;

  private allMonths = [
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

  private initPregnancyPicker() {
    this.weeks = Array.from({ length: 42 }, (_, i) => i);
    this.days = Array.from({ length: 7 }, (_, i) => i);

    this.selectedWeek = this.weeks[0];
    this.selectedDay = this.days[0];
  }
  private initLastPeriodPlanning() {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    this.restrictPastDates = false;
    this.restrictFutureDates = true;
    this.minDate = twoMonthsAgo;

    const startYear = twoMonthsAgo.getFullYear();
    const endYear = now.getFullYear();
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    this.selectedYear = now.getFullYear();
    this.selectedMonth = this.allMonths[now.getMonth()];
    this.selectedDay = now.getDate();

    this.updateDateBoundaries();
  }

  private initLastPeriodPregnancy() {
    const now = new Date();
    // 40 weeks ago
    const fortyWeeksAgo = new Date(now.getTime() - 40 * 7 * 24 * 60 * 60 * 1000);

    this.restrictPastDates = false;
    this.restrictFutureDates = true;

    const startYear = fortyWeeksAgo.getFullYear();
    const endYear = now.getFullYear();
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    this.selectedYear = now.getFullYear();
    this.selectedMonth = this.allMonths[now.getMonth()];
    this.selectedDay = now.getDate();

    this.minDate = fortyWeeksAgo;
    this.updateDateBoundaries();
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

    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

    this.minDate = twoYearsAgo;

    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    this.months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('en', { month: 'long' }),
    );

    const startYear = twoYearsAgo.getFullYear();
    const endYear = now.getFullYear();
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    this.selectedYear = now.getFullYear();
    this.selectedMonth = this.allMonths[now.getMonth()];
    this.selectedDay = now.getDate();

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
      case 'lastPeriodPregnancy':
        return { day: this.selectedDay, month: this.selectedMonth, year: this.selectedYear };
      case 'lastPeriodPlanning':
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
      case 'lastPeriodPlanning':
        this.initLastPeriodPlanning();
        break;

      case 'lastPeriodPregnancy':
        this.initLastPeriodPregnancy();
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
    if (!this.restrictPastDates && !this.restrictFutureDates && !this.minDate) return;

    const now = new Date();

    if (
      this.minDate &&
      this.selectedYear === this.minDate.getFullYear() &&
      this.selectedYear === now.getFullYear()
    ) {
      this.months = this.allMonths.slice(this.minDate.getMonth(), now.getMonth() + 1);
    } else if (this.minDate && this.selectedYear === this.minDate.getFullYear()) {
      this.months = this.allMonths.slice(this.minDate.getMonth());
    } else if (this.restrictFutureDates && this.selectedYear === now.getFullYear()) {
      this.months = this.allMonths.slice(0, now.getMonth() + 1);
    } else {
      this.months = [...this.allMonths];
    }

    if (!this.months.includes(this.selectedMonth)) {
      this.selectedMonth = this.restrictFutureDates
        ? this.months[this.months.length - 1]
        : this.months[0];
    }

    const monthIndex = this.allMonths.indexOf(this.selectedMonth);
    const totalDaysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();

    let startDay = 1;
    let endDay = totalDaysInMonth;

    if (
      this.minDate &&
      this.selectedYear === this.minDate.getFullYear() &&
      monthIndex === this.minDate.getMonth()
    ) {
      startDay = this.minDate.getDate();
    }

    if (
      this.restrictFutureDates &&
      this.selectedYear === now.getFullYear() &&
      monthIndex === now.getMonth()
    ) {
      endDay = now.getDate();
    }

    this.days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);

    if (!this.days.includes(this.selectedDay)) {
      this.selectedDay = this.restrictFutureDates ? this.days[this.days.length - 1] : this.days[0];
    }
  }
}
