import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}

  hidePassword = true;

  loginForm: FormGroup = new FormGroup({
    phone: new FormControl(null, [Validators.required]), // Only check if it's not empty
    password: new FormControl(null, [Validators.required]),
    remember: new FormControl(false),
  });

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  }

  login() {
    this.router.navigate(['/main-layout']);
  }
}
