import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import {
  BackendReminder,
  ReminderService,
} from '../../../core/services/Organizer/reminder.service';

interface UIReminder {
  id: string;
  title: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerComponent, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './reminder-list.component.html',
  styleUrl: './reminder-list.component.scss',
})
export class ReminderListComponent implements OnInit {
  private reminderService = inject(ReminderService);

  reminders: UIReminder[] = [];

  newReminderTitle = '';
  showDateModal = false;
  editingId: string | null = null;

  modalStep: 'date' | 'time' = 'date';
  tempDate: any = null;
  tempTime: any = null;

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.reminderService.getReminders().subscribe({
      next: (data) => {
        this.reminders = data.map((item) => this.formatDateForUI(item));
      },
      error: (err) => console.error('Failed to load reminders', err),
    });
  }

  openDateModal() {
    if (this.newReminderTitle.trim()) {
      this.editingId = null;
      this.showDateModal = true;
      this.modalStep = 'date';
    }
  }

  onDateChange(val: any) {
    this.tempDate = val;
  }
  onTimeChange(val: any) {
    this.tempTime = val;
  }

  editReminder(item: UIReminder) {
    this.editingId = item.id;
    this.newReminderTitle = item.title;
    this.modalStep = 'date';
    this.showDateModal = true;
  }

  handleNextStep() {
    if (this.modalStep === 'date') {
      this.tempDate = this.tempDate || { day: 1, month: 'January', year: 2025 };
      this.modalStep = 'time';
    } else {
      this.addReminder();
    }
  }

  addReminder() {
    const t = this.tempTime || { hour: 12, minute: '00', period: 'AM' };
    const isoString = this.createIsoString(this.tempDate, t);

    if (this.editingId) {
      //place holder till we get an edit endpoint
      console.warn('Backend missing PUT endpoint to save edits!');
    } else {
      const payload = {
        title: this.newReminderTitle,
        description: '',
        reminderDateTime: isoString,
        category: 'General',
      };

      this.reminderService.addReminder(payload).subscribe({
        next: (createdReminder) => {
          this.reminders.push(this.formatDateForUI(createdReminder));
          this.resetForm();
        },
        error: (err) => console.error('Failed to add reminder', err),
      });
    }
  }

  deleteReminder(id: string) {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        this.reminders = this.reminders.filter((r) => r.id !== id);
      },
      error: (err) => console.error('Failed to delete reminder', err),
    });
  }

  resetForm() {
    this.newReminderTitle = '';
    this.showDateModal = false;
    this.tempDate = null;
    this.tempTime = null;
  }

  private formatDateForUI(item: BackendReminder): UIReminder {
    const d = new Date(item.reminderDateTime);
    return {
      id: item.id,
      title: item.title,
      date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: d
        .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        .replace(' ', ''),
    };
  }

  private createIsoString(dateObj: any, timeObj: any): string {
    const months = [
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
    const monthIndex = months.indexOf(dateObj.month);

    let hour = Number(timeObj.hour);
    if (timeObj.period === 'PM' && hour !== 12) hour += 12;
    if (timeObj.period === 'AM' && hour === 12) hour = 0;

    const date = new Date(dateObj.year, monthIndex, dateObj.day, hour, Number(timeObj.minute));
    return date.toISOString();
  }
}
