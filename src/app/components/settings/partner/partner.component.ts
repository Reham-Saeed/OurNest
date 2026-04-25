import { Component } from '@angular/core';
import { PartnerService } from '../../../core/services/partner/partner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AppStateService } from '../../../core/services/app-state/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner',
  imports: [FormsModule, CommonModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
})
export class PartnerComponent {
  step: 'input' | 'code' = 'input';
  role: string = 'Mother';

  partnerUsername = '';
  partnerEmail = '';
  invitationCode = '';
  pairingToken = '';

  errorMsg = '';
  isLoading = false;
  copied = false;

  constructor(
    private partnerService: PartnerService,
    private _AppStateService: AppStateService,
    private router: Router,
  ) {}

  ngOnInit() {
    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;

      this.role = state.role;
      if (state.isLinked) {
        this.step = 'code';
      } else {
        this.step = 'input';
      }
    });
  }
  handleSubmit() {
    if (this.role === 'Mother') {
      this.sendInvite();
    } else {
      this.acceptInvite();
    }
  }
  sendInvite() {
    if (!this.partnerUsername.trim()) {
      this.errorMsg = "Please enter your partner's username.";
      return;
    }

    this.partnerEmail = `${this.partnerUsername.trim().toLowerCase().replace(/\s+/g, '')}@test.com`;
    this.errorMsg = '';
    this.isLoading = true;

    this.partnerService.invitePartner({ partnerEmail: this.partnerEmail }).subscribe({
      next: (res) => {
        this.pairingToken = res.token;
        this.step = 'code';
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Something went wrong. Please try again.';
        this.isLoading = false;
      },
    });
  }

  acceptInvite() {
    if (!this.invitationCode.trim()) {
      this.errorMsg = 'Please enter the invitation code.';
      return;
    }

    this.errorMsg = '';
    this.isLoading = true;

    this.partnerService.acceptPartnerInvite(this.invitationCode.trim()).subscribe({
      next: () => {
        this.isLoading = false;
        this._AppStateService.setAppState().subscribe();
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMsg = 'Invalid code. Please try again.';
        this.isLoading = false;
      },
    });
  }

  copyCode() {
    navigator.clipboard.writeText(this.pairingToken).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
