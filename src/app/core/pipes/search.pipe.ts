import { Pipe, PipeTransform } from '@angular/core';
import { IPost } from '../interfaces/community';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(posts: IPost[], word: string): IPost[] {
    if (!word) return posts;

    word = word.toLowerCase();

    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(word) || post.authorName.toLowerCase().includes(word),
    );
  }
}
