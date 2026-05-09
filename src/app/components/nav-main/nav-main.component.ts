import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppStateService } from '../../core/services/app-state/app-state.service';

@Component({
  selector: 'app-nav-main',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-main.component.html',
  styleUrl: './nav-main.component.scss',
})
export class NavMainComponent {
  mobileMenuOpen = false;
  stateType: 'planning' | 'pregnancy' | 'babycare' = 'planning';

  constructor(
    private router: Router,
    private _AppStateService: AppStateService,
  ) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngOnInit() {
    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;

      this.stateType = state?.mode;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mobileMenuOpen = false;
      }
    });
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  isHomeActive(): boolean {
    return (
      this.router.url === '/home' ||
      this.router.url === '/pregnancy-tracker' ||
      this.router.url === '/period-tracker' ||
      this.router.url === '/baby-care' ||
      this.router.url === '/baby-care/feeding-guid' ||
      this.router.url === '/baby-care/vaccination' ||
      this.router.url === '/baby-care/vitamins'
    );
  }
  isListActive(): boolean {
    return this.router.url === '/organizer/todo' || this.router.url === '/organizer/reminder';
  }
}
