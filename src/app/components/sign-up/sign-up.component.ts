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
import {
  FacebookLoginProvider,
  SocialAuthService,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private socialAuthService = inject(SocialAuthService);

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.isLoading = true;
        this.errorMessage = '';

        const externalToken = user.provider === 'GOOGLE' ? user.idToken : user.authToken;

        if (!externalToken) {
          this.isLoading = false;
          this.errorMessage = 'Failed to retrieve token from ' + user.provider;
          return;
        }

        const selectedRole = localStorage.getItem('selectedRole') || 'Parent';
        const authCall =
          user.provider === 'GOOGLE'
            ? this.authService.loginWithGoogle({ token: externalToken, role: selectedRole })
            : this.authService.loginWithFacebook({ token: externalToken, role: selectedRole });

        authCall.subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              localStorage.removeItem('selectedRole');
              localStorage.removeItem('currentStep');
              this.router.navigate(['/home']);
            } else {
              this.errorMessage = response.error || `${user.provider} login failed.`;
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.error || `Server error during ${user.provider} login.`;
            console.error(`${user.provider} login API error:`, err);
          },
        });
      }
    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  signUpForm: FormGroup = new FormGroup(
    {
      username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\+?[0-9]{11,15}$/),
      ]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      rePassword: new FormControl(null),
    },
    { validators: this.confirmPassword },
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
      username: this.signUpForm.value.username,
      password: this.signUpForm.value.password,
      phoneNumber: this.signUpForm.value.phoneNumber,
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
