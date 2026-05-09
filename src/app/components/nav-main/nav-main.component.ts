import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppStateService } from '../../core/services/app-state/app-state.service';
import { SettingsService } from '../../core/services/settings/settings.service';

@Component({
  selector: 'app-nav-main',
  standalone: true, // Assuming this based on your 'imports' array
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-main.component.html',
  styleUrl: './nav-main.component.scss',
})
export class NavMainComponent implements OnInit {
  mobileMenuOpen = false;
  stateType: 'planning' | 'pregnancy' | 'babycare' | 'pending' | string = 'planning';

  // --- NEW: Profile Image Variables ---
  userProfilePic: string | null = null;
  private backendServerUrl = 'http://localhost:5038/'; 

  private _SettingsService = inject(SettingsService);

  constructor(
    private router: Router,
    private _AppStateService: AppStateService,
  ) {}

  ngOnInit() {
    // 1. Fetch Profile Image
    this.loadUserProfilePic();

    // 2. Track App State
    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;
      this.stateType = state?.mode as any;
    });

    // 3. Close mobile menu on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mobileMenuOpen = false;
      }
    });
  }

  // --- NEW: Load Profile Image Logic ---
  loadUserProfilePic() {
    this._SettingsService.getProfile().subscribe({
      next: (profile) => {
        if (profile.profilePictureUrl) {
          // Clean the path to prevent double slashes (http://localhost:5038//uploads...)
          const cleanPath = profile.profilePictureUrl.startsWith('/') 
            ? profile.profilePictureUrl.substring(1) 
            : profile.profilePictureUrl;
            
          // If the URL already has http (like Cloudinary), use it directly. Otherwise, attach the backend URL.
          this.userProfilePic = profile.profilePictureUrl.startsWith('http') 
            ? profile.profilePictureUrl 
            : this.backendServerUrl + cleanPath;
        }
      },
      error: (err) => {
        console.error('Failed to load profile picture for navbar', err);
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
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