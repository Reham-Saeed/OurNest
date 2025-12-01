import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewsComponent } from './reviews/reviews.component';
import { GroupsComponent } from './groups/groups.component';
import { FriendsComponent } from './friends/friends.component';

export interface Group {
  title: string;
  description: string;
  members: number;
}

@Component({
  selector: 'app-mothers-community',
  imports: [CommonModule, FormsModule, ReviewsComponent, GroupsComponent, FriendsComponent],
  templateUrl: './mothers-community.component.html',
  styleUrl: './mothers-community.component.scss',
})
export class MothersCommunityComponent {
  activeTab: string = 'feed';

  setActive(tab: string) {
    this.activeTab = tab;
  }
}
