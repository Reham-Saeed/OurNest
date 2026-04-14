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
  rawDate: string;
  isEditing?: boolean;
  editTitle?: string;
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
  timeError: string = '';

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
    //  this.modalStep = 'date';
    //  this.showDateModal = true;
  }

  startInlineEdit(item: UIReminder) {
    item.isEditing = true;
    item.editTitle = item.title;
  }

  cancelInlineEdit(item: UIReminder) {
    item.isEditing = false;
  }

  saveInlineEdit(item: UIReminder) {
    if (!item.editTitle || !item.editTitle.trim()) {
      this.cancelInlineEdit(item);
      return;
    }

    const payload = {
      title: item.editTitle.trim(),
      date: item.rawDate,
    };

    this.reminderService.updateReminder(item.id, payload).subscribe({
      next: () => {
        item.title = item.editTitle!;
        item.isEditing = false;
      },
      error: (err) => console.error('Failed to update inline', err),
    });
  }

  openDateEditModal(item: UIReminder) {
    this.editingId = item.id;
    this.newReminderTitle = item.title;
    this.showDateModal = true;
    this.modalStep = 'date';
  }

  handleNextStep() {
    this.timeError = '';

    if (this.modalStep === 'date') {
      this.tempDate = this.tempDate || this.getCurrentDateTimeObj().dateObj;
      this.modalStep = 'time';
    } else {
      const d = this.tempDate || this.getCurrentDateTimeObj().dateObj;
      const t = this.tempTime || this.getCurrentDateTimeObj().timeObj;
      const targetDate = new Date(this.createIsoString(d, t));
      const now = new Date();

      if (targetDate < now) {
        this.timeError = 'You cannot set a reminder in the past!';
        return;
      }

      this.addReminder();
    }
  }

  addReminder() {
    let finalIsoString: string;
    const current = this.getCurrentDateTimeObj();

    if (this.tempDate && this.tempTime) {
      finalIsoString = this.createIsoString(this.tempDate, this.tempTime);
    } else if (this.editingId) {
      const existingItem = this.reminders.find((r) => r.id === this.editingId);
      finalIsoString = existingItem!.rawDate;
    } else {
      const d = this.tempDate || current.dateObj;
      const t = this.tempTime || current.timeObj;
      finalIsoString = this.createIsoString(d, t);
    }
    if (this.editingId) {
      const updatePayload = {
        title: this.newReminderTitle,
        date: finalIsoString,
      };

      this.reminderService.updateReminder(this.editingId, updatePayload).subscribe({
        next: () => {
          const index = this.reminders.findIndex((r) => r.id === this.editingId);
          if (index !== -1) {
            const updatedData = {
              id: this.editingId!,
              title: updatePayload.title,
              reminderDateTime: updatePayload.date,
            } as BackendReminder;

            this.reminders[index] = this.formatDateForUI(updatedData);
          }
          this.resetForm();
        },
        error: (err) => console.error('Failed to update reminder', err),
      });
    } else {
      const payload = {
        title: this.newReminderTitle,
        description: '',
        reminderDateTime: finalIsoString,
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
    this.timeError = '';
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
      rawDate: item.reminderDateTime,
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

  private getCurrentDateTimeObj() {
    const now = new Date();
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

    let hour = now.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return {
      dateObj: { day: now.getDate(), month: months[now.getMonth()], year: now.getFullYear() },
      timeObj: { hour: hour, minute: now.getMinutes().toString().padStart(2, '0'), period: period },
    };
  }
}
