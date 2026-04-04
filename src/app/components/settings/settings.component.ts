import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { PartnerComponent } from './partner/partner.component';
import { ChangeModeComponent } from './change-mode/change-mode.component';
import { AuthService } from '../../core/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

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

  savedRole: 'mother' | 'father' | null = null;
  activeSection: 'partner' | 'mode' = 'mode';

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        try {
          this.socialAuthService.signOut();
        } catch (err) {}

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed on the backend:', err);

        this.router.navigate(['/auth/login']);
      },
    });
  }
}
