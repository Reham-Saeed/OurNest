import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './friend-chat.component.html',
  styleUrl: './friend-chat.component.scss',
})
export class FriendChatComponent {
  messages = [
    { from: 'me', text: 'Is morning sickness at 10 weeks still normal?' },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
    { from: 'me', text: 'Is morning sickness at 10 weeks still normal?' },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
    { from: 'me', text: 'Is morning sickness at 10 weeks still normal?' },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
    {
      from: 'user',
      text: 'Yes, it is very common for morning sickness to peak between 9 and 12 weeks. If you are unable to keep food or fluids down, please contact',
    },
  ];

  newMessage = '';

  sendMessage() {
    
  }
}
