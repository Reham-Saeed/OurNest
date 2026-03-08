import { Component } from '@angular/core';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions-flow',
  imports: [DatePickerComponent, ReactiveFormsModule],
  templateUrl: './questions-flow.component.html',
  styleUrl: './questions-flow.component.scss',
})
export class QuestionsFlowComponent {

  private _currentStep: number = 1;

  constructor(private router: Router) {}

  get currentStep(): number {
    return this._currentStep;
  }

  set currentStep(step: number) {
    this._currentStep = step;
    localStorage.setItem('currentStep', step.toString()); 
  }

  ngOnInit() {
    const savedStep = localStorage.getItem('currentStep');
    this._currentStep = savedStep ? +savedStep : 1;
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }

    if (this.currentStep === 6 || this.currentStep === 7 || this.currentStep === 8) {
      this.currentStep = 5;
    }
  }

  goNext() {
  
    if (this.currentStep === 9) {
      this.router.navigate(['auth/signup']);
    }else{
        this.currentStep = 9;
    }
  }

  chooseRole(role: 'mother' | 'father') {
    this.formData.role = role;
    this.currentStep = role === 'mother' ? 2 : 9;
  }

  choosePregnant(value: boolean) {
    this.formData.pregnant = value;
    this.currentStep = 3;
  }

  saveDetails() {
    this.formData.height = this.detailsForm.value.height;
    this.formData.weight = this.detailsForm.value.weight;
    this.currentStep = 4;
  }

  selectFirstChildStatus(value: boolean) {
    this.formData.firstChild = value;
    this.currentStep = 5;
  }

  selectKnownInfo(type: 'lastPeriod' | 'pregnant' | 'dueDate') {
    if (type === 'lastPeriod') this.currentStep = 6;
    if (type === 'pregnant') this.currentStep = 7;
    if (type === 'dueDate') this.currentStep = 8;
  }

  onLastPeriodSelect(date: any) { this.formData.lastPeriodDate = date; }
  onGestationalAgeSelect(age: any) { this.formData.gestationalAge = age; }
  onExpectedDueDateSelect(date: any) { this.formData.expectedDueDate = date; }
  onBirthDateSelect(date: any) { this.formData.birthDate = date; }

  formData: any = {
    role: null,
    pregnant: null,
    height: null,
    weight: null,
    lastPeriodDate: null,
    gestationalAge: null,
    expectedDueDate: null,
    birthDate: null,
    firstChild: null,
  };

  detailsForm = new FormGroup({
    height: new FormControl(''),
    weight: new FormControl(''),
  });

}
