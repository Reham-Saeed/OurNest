import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service'; 
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep: 1 | 2 | 3 = 1;
  isLoading = false;
  apiError = '';

  systemEmail = '';
  resetToken = '';


  step1Form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    recoveryEmail: new FormControl('', [
      Validators.required, 
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    ])
  });


  step2Form = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)])
  });


  step3Form = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmNewPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // ==========================================
  // STEP 1 SUBMIT
  // ==========================================
  onSubmitStep1() {
    if (this.step1Form.invalid) {
      this.step1Form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const rawUsername = this.step1Form.value.username?.trim() || '';
    this.systemEmail = `${rawUsername.replace(/\s+/g, '')}@test.com`;
    const recoveryEmail = this.step1Form.value.recoveryEmail?.trim() || '';

    this.authService.forgotPassword({ email: this.systemEmail, recoveryEmail }).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 2; 
      },
      error: (err) => {
        this.isLoading = false;
        this.apiError = err.error?.message || 'Failed to send recovery email. Please check your username.';
      }
    });
  }

  // ==========================================
  // STEP 2 SUBMIT
  // ==========================================
  onSubmitStep2() {
    if (this.step2Form.invalid) {
      this.step2Form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const otpCode = this.step2Form.value.otp?.trim() || '';

    this.authService.verifyOtp({ email: this.systemEmail, otpCode }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.resetToken = res.resetToken;
          this.currentStep = 3; 
        } else {
          this.apiError = res.error || 'Invalid OTP. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.apiError = err.error?.message || 'Verification failed. Please try again.';
      }
    });
  }

  // ==========================================
  // STEP 3 SUBMIT
  // ==========================================
  onSubmitStep3() {
    if (this.step3Form.invalid) {
      this.step3Form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.apiError = '';

    const payload = {
      email: this.systemEmail,
      resetToken: this.resetToken,
      newPassword: this.step3Form.value.newPassword || '',
      confirmNewPassword: this.step3Form.value.confirmNewPassword || ''
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']); // Success!
      },
      error: (err) => {
        this.isLoading = false;
        this.apiError = err.error?.message || 'Failed to reset password. The link may have expired.';
      }
    });
  }
}