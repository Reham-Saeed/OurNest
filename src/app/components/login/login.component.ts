import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  GoogleLoginProvider,
  SocialAuthService,
  GoogleSigninButtonModule,
  SocialUser,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private socialAuthService = inject(SocialAuthService);

  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    remember: new FormControl(false),
  });

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

        const authCall =
          user.provider === 'GOOGLE'
            ? this.authService.loginWithGoogle({ token: externalToken, role: 'Parent' })
            : this.authService.loginWithFacebook({ token: externalToken, role: 'Parent' });

        authCall.subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
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

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.error || 'Invalid credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Server error. Please try again later.';
        console.error('Login error:', err);
      },
    });
  }

  login() {
    this.router.navigate(['/home']);
  }
}
