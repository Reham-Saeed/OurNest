import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { identity } from 'rxjs';

@Component({
  selector: 'app-friends',
  imports: [CommonModule, FormsModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  constructor(private router: Router) {}

  users = [
    { id: 1, name: 'Salma Mohamed', initials: 'SM', status: 'online', color: 'bg-green-500' },
    { id: 2, name: 'Lina Mohamed', initials: 'LM', status: 'offline', color: 'bg-gray-400' },
    { id: 3, name: 'Salma Mohamed', initials: 'SM', status: 'online', color: 'bg-green-500' },
    { id: 4, name: 'Lina Mohamed', initials: 'LM', status: 'offline', color: 'bg-gray-400' },
    { id: 5, name: 'Salma Mohamed', initials: 'SM', status: 'online', color: 'bg-green-500' },
    { id: 6, name: 'Lina Mohamed', initials: 'LM', status: 'offline', color: 'bg-gray-400' },
  ];

  unfriend(user: any) {
    this.users = this.users.filter((u) => u !== user);
  }

  openChat() {
    this.router.navigate(['/chat']);
  }
}
