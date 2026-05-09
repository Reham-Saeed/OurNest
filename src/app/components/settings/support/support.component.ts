import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  imports: [CommonModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {
contactInfo = [
  {
    title: 'Email Address',
    value: 'support@ournest.com',
    icon:
      'M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 9.659A2.25 2.25 0 0 1 2.25 7.743V7.5'
  },

  {
    title: 'Phone Number',
    value: '+20 XXX XXX XXXX',
    icon:
      'M2.25 3.75c0 8.284 6.716 15 15 15h2.25a1.5 1.5 0 0 0 1.5-1.5v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.5 1.5 0 0 0-1.465.417l-.97.97a12.035 12.035 0 0 1-5.292-5.292l.97-.97a1.5 1.5 0 0 0 .417-1.465L8.33 3.102A1.125 1.125 0 0 0 7.239 2.25H5.867A1.5 1.5 0 0 0 4.367 3.75H2.25Z'
  },

  {
    title: 'Working Hours',
    value: 'Sunday - Thursday | 9 AM - 5 PM',
    icon:
      'M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'
  }
];
}
