import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-policy',
  imports: [CommonModule],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss',
})
export class PolicyComponent {
 sections = [
    {
      number: '01',
      title: 'Data Collection',
      content: 'We collect only necessary information to improve your experience and provide our services effectively.',
    },
    {
      number: '02',
      title: 'Data Sharing',
      content: 'We never sell your data. Sharing happens only with your explicit consent or when required by law.',
    },
    {
      number: '03',
      title: 'Security',
      content: 'We use industry-standard secure systems and encryption to protect your personal information at all times.',
    },
  ];
}
