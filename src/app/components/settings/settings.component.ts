import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { PartnerComponent } from "./partner/partner.component";
import { ChangeModeComponent } from "./change-mode/change-mode.component";

@Component({
  selector: 'app-settings.component',
  imports: [ReactiveFormsModule, DatePipe, CommonModule, DatePickerComponent, FormsModule, PartnerComponent, ChangeModeComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  savedRole: 'mother' | 'father' | null = null;
  activeSection: 'partner' | 'mode' = 'mode';
}
