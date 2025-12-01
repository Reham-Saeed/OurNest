import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-post-auth-nav',
  imports: [CommonModule],
  templateUrl: './post-auth-nav.component.html',
  styleUrl: './post-auth-nav.component.scss',
})
export class PostAuthNavComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
