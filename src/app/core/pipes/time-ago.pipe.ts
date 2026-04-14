import { Pipe, PipeTransform, NgZone, OnDestroy } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: any;

  constructor(private ngZone: NgZone) {}

  transform(value: string | Date): string {
    if (!value) return '';

    if (!this.timer) {
      this.ngZone.runOutsideAngular(() => {
        this.timer = setInterval(() => {
          this.ngZone.run(() => {});
        }, 60000);
      });
    }

    const cleaned = value.toString().split('.')[0];
    const past = new Date(cleaned + 'Z');
    const now = new Date();

    const diffSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m`;

    const diffHours = Math.floor(diffSeconds / 3600);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffSeconds / 86400);
    if (diffDays < 30) return `${diffDays}d`;

    const diffMonths = Math.floor(diffSeconds / 2592000);
    if (diffMonths < 12) return `${diffMonths}mo`;

    const diffYears = Math.floor(diffSeconds / 31536000);
    return `${diffYears}y`;
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
