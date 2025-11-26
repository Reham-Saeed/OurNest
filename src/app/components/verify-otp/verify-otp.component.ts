import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  otpForm: FormGroup = new FormGroup({
    otp: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{4}$/)]),
  });

  onSubmit() {
    if (this.otpForm.invalid) return;

    console.log('Verifying:', this.otpForm.value.otp);
  }
}
