import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

interface Reminder {
  id: number;
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
export class ReminderListComponent {
  reminders: Reminder[] = [
    { id: 1, title: 'Medical consultation', date: 'October 12, 2025', time: '7:00AM' },
    { id: 2, title: 'Take prenatal vitamins', date: 'October 12, 2025', time: '9:45AM' },
  ];

  newReminderTitle = '';
  showDateModal = false;
  editingId: number | null = null;

  modalStep: 'date' | 'time' = 'date';

  tempDate: any = null;
  tempTime: any = null;

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

  editReminder(item: Reminder) {
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
    const d = this.tempDate;
    const dateStr = `${d.month} ${d.day}, ${d.year}`;

    const t = this.tempTime || { hour: 12, minute: '00', period: 'AM' };
    const timeStr = `${t.hour}:${t.minute}${t.period}`;

    if (this.editingId) {
      const index = this.reminders.findIndex((r) => r.id === this.editingId);
      if (index !== -1) {
        this.reminders[index] = {
          id: this.editingId,
          title: this.newReminderTitle,
          date: dateStr,
          time: timeStr,
        };
      }
    } else {
      this.reminders.push({
        id: Date.now(),
        title: this.newReminderTitle,
        date: dateStr,
        time: timeStr,
      });
    }
    this.newReminderTitle = '';
    this.showDateModal = false;
    this.tempDate = null;
    this.tempTime = null;
  }

  deleteReminder(id: number) {
    this.reminders = this.reminders.filter((r) => r.id !== id);
  }
}
