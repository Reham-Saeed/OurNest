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
import { SupportComponent } from './support/support.component';
import { PolicyComponent } from './policy/policy.component';
import { AboutComponent } from './about/about.component';

@Component({
  selector: 'app-settings.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PartnerComponent,
    ChangeModeComponent,
    SupportComponent,
    PolicyComponent,
    AboutComponent,
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

  activeSection: string = 'mode';
  stateType: 'planning' | 'pregnancy' | 'babycare' = 'planning';
  stateRole: 'Mother' | 'Father' = 'Mother';

  imageUrl: string | null = null;
  sidebarOpen = false;

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
        this.imageUrl = res.url;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });

    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;

      this.stateType = state?.mode;
      this.stateRole = state?.role;

      if (state.role === 'Father') {
        this.activeSection = 'partner';
      }
    });
  }

  get showPartner(): boolean {
    return this.stateType !== 'planning';
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        localStorage.clear();
      }
    });
  }

  showCopied = false;

  copyWebsiteLink() {
    const websiteUrl = 'https://OurNest.com';

    navigator.clipboard.writeText(websiteUrl).then(() => {
      this.showCopied = true;

      setTimeout(() => {
        this.showCopied = false;
      }, 2000);
    });
  }
}
