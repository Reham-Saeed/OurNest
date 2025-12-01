import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  posts = [
    {
      name: 'Salma Mohamed',
      image: 'assets/user.jpg',
      text: 'A little advice for all moms: Take care of yourself so you can take care of your child. Even 10 minutes a day just for yourself can make a huge difference ❤️',
      likes: 10,
      comments: [
        { name: 'Sara', image: 'assets/user.jpg', text: 'So true 👏', replies: [], time: '2 h' },
        {
          name: 'Mona',
          image: 'assets/user.jpg',
          text: 'Absolutely agree ❤️',
          replies: [],
          time: '7 d',
        },
      ],
      showComments: false,
      newComment: '',
      replyIndex: null,
      replyText: '',
    },

    {
      name: 'Lina Mohamed',
      image: 'assets/user.jpg',
      text: 'If your child sleeps late, try creating a fixed bedtime routine. Dim lights, a short story, and a consistent sleep time can make a big difference within a week 🌙✨',
      likes: 5,
      comments: [
        {
          name: 'Sara',
          image: 'assets/user.jpg',
          text: 'I’ll try this tonight 👌',
          replies: [],
          time: '2 h',
        },
      ],
      showComments: false,
      newComment: '',
      replyIndex: null,
      replyText: '',
    },
  ];

  toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  addComment(post: any) {}

  startReply(post: any, index: number) {
    post.replyIndex = index;
    post.replyText = '';
  }

  addReply(post: any, index: number) {}

  likeComment(post: any, index: number) {}

  dislikeComment(post: any, index: number) {}
}
