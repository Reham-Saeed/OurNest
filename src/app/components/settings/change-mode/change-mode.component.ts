import { DatePipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-change-mode',
  imports: [ReactiveFormsModule, DatePipe, CommonModule, DatePickerComponent],
  templateUrl: './change-mode.component.html',
  styleUrl: './change-mode.component.scss',
})
export class ChangeModeComponent {
 savedRole: 'mother' | 'father' | null = null;

  isChildbirthMode = false;
  isTryingMode = false;

  showChildbirthModal = false;
  showTryingModal = false;

  selectedMode: 'yes' | 'no' = 'no';

  isDatePickerOpen = false;
  activeDateField: 'lastPeriod' | 'laborDate' | 'conceptionDate' | null = null;
  tempDate: string | null = null;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      lastPeriod: ['20-09-2025'],
      laborDate: ['27-06-2026'],
      conceptionDate: ['04-10-2026'],
      gestational:['Week: 9, days: 5']
    });
  }

  openChildbirthModal(event: any) {
    event.target.checked = this.isChildbirthMode;
    this.showChildbirthModal = true;
  }

  confirmChildbirthSwitch() {
    this.isChildbirthMode = true;
    this.showChildbirthModal = false;
  }

  cancelChildbirthSwitch() {
    this.isChildbirthMode = false;
    this.showChildbirthModal = false;
  }

  openTryingModal(event: any) {
    event.target.checked = this.isTryingMode;
    this.showTryingModal = true;
  }

  confirmTryingSwitch() {
    this.isTryingMode = true;
    this.showTryingModal = false;
  }

  cancelTryingSwitch() {
    this.isTryingMode = false;
    this.showTryingModal = false;
  }

  setMode(mode: 'yes' | 'no') {
    this.selectedMode = mode;
  }

  closeModal() {
    this.showChildbirthModal = false;
    this.showTryingModal = false;
  }

  openPicker(field: 'lastPeriod' | 'laborDate' | 'conceptionDate') {
    this.activeDateField = field;
    this.tempDate = this.form.get(field)?.value;
    this.isDatePickerOpen = true;
  }

  onDateSelected(date: any) {
    const formattedDate = `${date.day}-${date.month}-${date.year}`;
    this.tempDate = formattedDate;
  }

  confirmDate() {
    if (this.activeDateField && this.tempDate) {
      this.form.get(this.activeDateField)?.setValue(this.tempDate);
    }

    this.isDatePickerOpen = false;
    this.activeDateField = null;
  }
}
