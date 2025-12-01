import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  groups: any[] = [
    {
      title: 'First Time Moms',
      description: 'Support group for mothers experiencing pregnancy for the first time',
      members: 1234,
    },
    {
      title: 'Healthy Pregnancy Diet',
      description: 'Share recipes and nutrition tips for a healthy pregnancy',
      members: 892,
    },
    {
      title: 'Exercise & Wellness',
      description: 'Safe exercises and wellness practices during pregnancy',
      members: 567,
    },
    {
      title: 'Second Trimester Support',
      description: 'Connect with moms in their second trimester',
      members: 743,
    },
  ];
}
