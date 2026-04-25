import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private router = inject(Router);
  forgotForm: FormGroup = new FormGroup({
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^\+?[0-9]{11,15}$/)]),
  });

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    console.log('Sending OTP to:', this.forgotForm.value.phone);
    this.router.navigate(['/auth/verify-otp']);
  }
}
