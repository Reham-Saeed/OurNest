import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  signUpForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
      ]),
      rePassword: new FormControl(null),
    },
    this.confirmPassword,
  );

  confirmPassword(form: AbstractControl) {
    if (form.get('password')?.value === form.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const role = localStorage.getItem('selectedRole') || 'mother';

    const payload = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      confirmPassword: this.signUpForm.value.rePassword,
      role: role,
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.removeItem('selectedRole');
          localStorage.removeItem('currentStep');
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.error || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'An account with this email already exists.';
        console.error('Registration failed:', err);
      },
    });
  }
}
