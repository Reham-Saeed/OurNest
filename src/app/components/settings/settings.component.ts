import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { PartnerComponent } from './partner/partner.component';
import { ChangeModeComponent } from './change-mode/change-mode.component';
import { AuthService } from '../../core/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AppStateService } from '../../core/services/app-state/app-state.service';
import { SettingsService } from '../../core/services/settings/settings.service';

@Component({
  selector: 'app-settings.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule,
    DatePickerComponent,
    FormsModule,
    PartnerComponent,
    ChangeModeComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);
  private _AppStateService = inject(AppStateService);
  private _SettingsService = inject(SettingsService);
  private route = inject(ActivatedRoute);

  activeSection: 'partner' | 'mode' = 'mode';
  stateType: 'planning' | 'pregnancy' | 'babycare' = 'planning';
  stateRole: 'Mother' | 'Father' = 'Mother';

  imageUrl: string | null = null;

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // preview
  const reader = new FileReader();
  reader.onload = () => {
    this.imageUrl = reader.result as string;
  };
  reader.readAsDataURL(file);

  // upload
  const formData = new FormData();
  formData.append('image', file);

  this._SettingsService.uploadImage(formData).subscribe({
    next: (res: any) => {
      console.log('uploaded:', res);
      this.imageUrl = res.url; // حسب الـ API عندك
    },
    error: (err) => {
      console.error(err);
    },
  });
}
  ngOnInit() {
    const role = this.authService.getUser()?.role;
    if (role === 'Father') {
      this.activeSection = 'partner';
    }
    this.route.queryParams.subscribe((params) => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });

    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;

      this.stateType = state?.mode;
      this.stateRole = state?.role;
    });
  }

  get showPartner(): boolean {
    return this.stateType !== 'planning';
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        try {
          this.socialAuthService.signOut();
        } catch (err) {}

        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed on the backend:', err);
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
