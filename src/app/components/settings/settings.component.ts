import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { PartnerComponent } from './partner/partner.component';
import { ChangeModeComponent } from './change-mode/change-mode.component';
import { AuthService } from '../../core/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AppStateService } from '../../core/services/app-state/app-state.service';
import { SettingsService } from '../../core/services/settings/settings.service';
import { SupportComponent } from './support/support.component';
import { AboutComponent } from './about/about.component';
import { PolicyComponent } from './policy/policy.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule,
    DatePickerComponent,
    FormsModule,
    PartnerComponent,
    ChangeModeComponent,
    SupportComponent,
    AboutComponent,
    PolicyComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);
  private _AppStateService = inject(AppStateService);
  private _SettingsService = inject(SettingsService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  sidebarOpen = false;
  activeSection: 'partner' | 'mode' | 'profile' | 'support' | 'policy' | 'about' | string = 'profile';
  
  stateType: 'planning' | 'pregnancy' | 'babycare' | 'pending' = 'pending';
  stateRole: 'Mother' | 'Father' | string = 'Mother';

  imageUrl: string | null = null;
  showCopied = false;

  isLoadingProfile = false;
  isSavingProfile = false;
  isSavingPassword = false;
  profileMessage = '';
  passwordMessage = '';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit() {
    this.initForms();
    this.loadUserProfile();

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
      this.stateType = state?.mode as any;
      this.stateRole = state?.role as any;
    });
  }

  initForms() {
   
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: [''],
      gender: [''],
      bio: [''],
      country: [''],
      city: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmNewPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  get showPartner(): boolean {
    return this.stateType !== 'planning' && this.stateType !== 'pending';
  }

  loadUserProfile() {
    this.isLoadingProfile = true;
    this._SettingsService.getProfile().subscribe({
      next: (profile) => {
        this.isLoadingProfile = false;
        this.imageUrl = profile.profilePictureUrl || null;
        
        let formattedDate = '';
        if (profile.dateOfBirth && !profile.dateOfBirth.startsWith('0001')) {
          formattedDate = profile.dateOfBirth.split('T')[0];
        }

        this.profileForm.patchValue({
          fullName: profile.fullName || '',
          dateOfBirth: formattedDate,
          gender: profile.gender || '',
          bio: profile.bio || '',
          country: profile.country || '',
          city: profile.city || ''
        });
      },
      error: (err) => {
        this.isLoadingProfile = false;
        console.error('Failed to load profile', err);
      }
    });
  }

  onProfileSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.profileMessage = '';

    const formValue = this.profileForm.value;
    const payload = {
      ...formValue,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : null
    };

    this._SettingsService.updateProfile(payload).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileMessage = 'Profile updated successfully!';
        setTimeout(() => this.profileMessage = '', 3000);
      },
      error: (err) => {
        this.isSavingProfile = false;
        console.error('Failed to update profile', err);
      }
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSavingPassword = true;
    this.passwordMessage = '';

    this._SettingsService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.isSavingPassword = false;
        this.passwordMessage = 'Password changed successfully!';
        this.passwordForm.reset();
        setTimeout(() => this.passwordMessage = '', 3000);
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.passwordMessage = 'Error: ' + (err.error?.message || 'Could not change password.');
        setTimeout(() => this.passwordMessage = '', 4000);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    this._SettingsService.uploadImage(formData).subscribe({
      next: (res: any) => {
        this.imageUrl = res.url || res.profilePictureUrl; 
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  copyWebsiteLink() {
    navigator.clipboard.writeText('https://ournest.com').then(() => {
      this.showCopied = true;
      setTimeout(() => (this.showCopied = false), 2000);
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        try { this.socialAuthService.signOut(); } catch (err) {}
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed on the backend:', err);
        this.router.navigate(['/auth/login']);
      },
    });
  }
}