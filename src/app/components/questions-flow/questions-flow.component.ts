import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BabyService } from '../../core/services/baby/baby.service';
import { MotherService } from '../../core/services/mother/mother.service';
import { OnboardingService } from '../../core/services/onboarding/onboarding.service';
import { PeriodTrackerService } from '../../core/services/trackers/period-tracker.service';
import { of, switchMap, tap } from 'rxjs';
import { PregnancyService } from '../../core/services/pregnancy/pregnancy.service';

type Step =
  | 'role'
  | 'mother:isPregnant'

  // pregnant
  | 'mother:pregnant:bodyDetails'
  | 'mother:pregnant:firstChild'
  | 'mother:pregnant:knownInfo'
  | 'mother:pregnant:lastPeriodDate'
  | 'mother:pregnant:gestationalAge'
  | 'mother:pregnant:expectedDueDate'
  | 'mother:pregnant:birthDate'

  // not pregnant
  | 'mother:notPregnant:isPlanning'
  | 'mother:notPregnant:planning'

  // not planning
  | 'mother:notPregnant:notPlanning:isHasBaby'
  | 'mother:notPregnant:notPlanning:hasBaby:birthDate'
  | 'mother:notPregnant:notPlanning:hasBaby:gender'
  | 'mother:notPregnant:notPlanning:hasBaby:weight'
  | 'mother:notPregnant:notPlanning:hasBaby:name'

  // father
  | 'father:birthDate';

@Component({
  selector: 'app-questions-flow',
  standalone: true,
  imports: [DatePickerComponent, ReactiveFormsModule],
  templateUrl: './questions-flow.component.html',
  styleUrl: './questions-flow.component.scss',
})
export class QuestionsFlowComponent implements OnInit {
  currentStep: Step = 'role';
  history: Step[] = [];
  showLastPeriodPicker = false;

  constructor(
    private router: Router,
    private _MotherService: MotherService,
    private _PregnancyService: PregnancyService,
    private _BabyService: BabyService,
    private _PeriodTrackerService: PeriodTrackerService,
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('step');
    if (saved) this.currentStep = saved as Step;
  }

  private saveState() {
    localStorage.setItem('step', this.currentStep);
  }

  private pushHistory() {
    this.history.push(this.currentStep);
  }

  goBack() {
    if (this.history.length) {
      this.currentStep = this.history.pop()!;
      this.saveState();
    }
  }

  private formatDate(date: { year: number; month: any; day: number }): string {
    const d = new Date(`${date.day} ${date.month} ${date.year}`);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openLastPeriodPicker() {
    this.showLastPeriodPicker = true;
  }

  onLastPeriodPicked(date: any) {
    const formattedDate = this.formatDate(date);
    this.periodDetails.patchValue({ lastPeriod: formattedDate });
  }

  closePicker() {
    this.showLastPeriodPicker = false;
  }

  next() {
    this.pushHistory();

    switch (this.currentStep) {
      // pregnant flow
      case 'mother:pregnant:firstChild':
        this.currentStep = 'mother:pregnant:knownInfo';
        break;

      case 'mother:pregnant:lastPeriodDate':
      case 'mother:pregnant:gestationalAge':
      case 'mother:pregnant:expectedDueDate':
        this.currentStep = 'mother:pregnant:birthDate';
        break;

      case 'father:birthDate':
        this.submitAll();
        return;

      // baby flow
      case 'mother:notPregnant:notPlanning:hasBaby:birthDate':
        this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:gender';
        break;

      case 'mother:notPregnant:notPlanning:hasBaby:weight':
        this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:name';
        break;
    }

    this.saveState();
  }


  chooseRole(role: 'mother' | 'father') {
    this.pushHistory();
    this.formData.role = role;
    this.currentStep = role === 'mother' ? 'mother:isPregnant' : 'father:birthDate';
    this.saveState();
  }

  choosePregnant(val: boolean) {
    this.pushHistory();
    this.formData.motherMode = val ? 'pregnant' : 'planning';
    this.formData.isPregnant = val;
    this.currentStep = val ? 'mother:pregnant:bodyDetails' : 'mother:notPregnant:isPlanning';
    this.saveState();
  }

  selectFirstChild(val: boolean) {
    this.pushHistory();
    this.formData.isFirstChild = val;
    this.currentStep = 'mother:pregnant:knownInfo';
    this.saveState();
  }

  selectPlanning(val: boolean) {
    this.pushHistory();
    this.formData.motherMode = val ? 'planning' : 'hasBaby';
    this.currentStep = val
      ? 'mother:notPregnant:planning'
      : 'mother:notPregnant:notPlanning:isHasBaby';
    this.saveState();
  }

  selectHasBaby(val: boolean) {
    this.pushHistory();
    if (val) {
      this.formData.motherMode = 'hasBaby';
      this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:birthDate';
      this.saveState();
    } else {
      this.formData.motherMode = null;
      this.router.navigate(['auth/signup']);
    }
  }

  selectKnownInfo(type: string) {
    this.pushHistory();
    this.formData.knowledgeType = type;
    if (type === 'lastPeriod') this.currentStep = 'mother:pregnant:lastPeriodDate';
    if (type === 'pregnantAge') this.currentStep = 'mother:pregnant:gestationalAge';
    if (type === 'dueDate') this.currentStep = 'mother:pregnant:expectedDueDate';
    this.saveState();
  }

  getPregnancyInput() {
    if (this.formData.knowledgeType === 'lastPeriod') {
      return {
        type: 'lmp',
        value: this.formData.lastPeriodDate,
      };
    }

    if (this.formData.knowledgeType === 'pregnantAge') {
      return {
        type: 'weeks',
        value: this.formData.gestationalWeeks,
      };
    }

    if (this.formData.knowledgeType === 'dueDate') {
      return {
        type: 'dueDate',
        value: this.formData.expectedDueDate,
      };
    }

    return null;
  }

  selectBabyGender(val: string) {
    this.formData.babyGender = val;
    this.pushHistory();
    this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:weight';
    this.saveState();
  }


  detailsForm = new FormGroup({
    height: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
  });

  periodDetails = new FormGroup({
    lastPeriod: new FormControl('', Validators.required),
    periodLength: new FormControl('', Validators.required),
    cycleLength: new FormControl('', Validators.required),
  });

  saveDetails() {
    if (this.currentStep === 'mother:pregnant:bodyDetails') {
      if (this.detailsForm.invalid) return;
      this.pushHistory();
      this.formData.height = this.detailsForm.value.height;
      this.formData.weight = this.detailsForm.value.weight;
      this.currentStep = 'mother:pregnant:firstChild';
      this.saveState();
    } else if (this.currentStep === 'mother:notPregnant:planning') {
      if (this.periodDetails.invalid) return;
      this.formData.lastPeriod = this.periodDetails.value.lastPeriod;
      this.formData.cycleLengthDays = this.periodDetails.value.cycleLength;
      this.formData.periodLengthDays = this.periodDetails.value.periodLength;
      this.submitAll();
    }
  }


  submitAll() {
    this.submitMother()
      .pipe(
        switchMap(() => {
          if (this.formData.isPregnant) {
            return this.submitPregnancy();
          }
          return of(null);
        }),

        // planning
        switchMap(() => {
          if (this.formData.motherMode === 'planning') {
            return this.submitPeriod();
          }
          return of(null);
        }),

        // baby
        switchMap(() => {
          if (this.formData.motherMode === 'hasBaby') {
            return this.submitBaby();
          }
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          localStorage.removeItem('step');
          this.router.navigate(['/']);
        },
        error: () => {},
      });
  }

  submitMother() {
    const payload = {
      height: Number(this.formData.height),
      weight: Number(this.formData.weight),
      bloodType: this.formData.bloodType || null,
    };
    return this._MotherService.createMother(payload);
  }

  submitPregnancy() {
    const input = this.getPregnancyInput();

    if (!input) return of(null);

    let payload: any = {};

    if (input.type === 'lmp') {
      payload.lastPeriodDate = input.value;
    }

    if (input.type === 'weeks') {
      payload.gestationalWeeks = input.value;
    }

    if (input.type === 'dueDate') {
      payload.expectedDueDate = input.value;
    }

    return this._PregnancyService.createPregnancy(payload);
  }

  submitPeriod() {
    const payload = {
      startDate: this.formData.lastPeriod,
      cycleLengthDays: Number(this.formData.cycleLengthDays),
      periodLengthDays: Number(this.formData.periodLengthDays),
      flowIntensity: 'Medium',
      symptoms: '',
      notes: '',
    };
    return this._PeriodTrackerService.addPeriod(payload);
  }

  submitBaby() {
    const payload = {
      name: this.formData.babyName,
      dateOfBirth: this.formData.birthDate,
      gender: this.formData.babyGender,
      birthWeight: Number(this.formData.babyWeight),
      birthHeight: this.formData.babyHeight || null,
    };
    return this._BabyService.createBaby(payload);
  }

  
  onLastPeriodSelect(date: any) {
    this.formData.lastPeriodDate = this.formatDate(date);
  }

  onGestationalAgeSelect(age: any) {
    this.formData.gestationalWeeks = age.week;
    this.formData.gestationalDays = age.day;
  }

  onExpectedDueDateSelect(date: any) {
    this.formData.expectedDueDate = this.formatDate(date);
  }

  onBirthDateSelect(date: any) {
    this.formData.birthDate = this.formatDate(date);
  }

  formData: any = {
    role: null,
    isPregnant: null,
    height: null, 
    weight: null, 
    isFirstChild: false,
    knowledgeType: null,
    lastPeriodDate: '2024-10-01',
    gestationalWeeks: null,
    gestationalDays: null,
    expectedDueDate: null,
    birthDate: null,
    lastPeriod: null,
    cycleLengthDays: null,
    periodLengthDays: null,
    babyGender: null,
    babyWeight: null,
    babyName: null,
    babyHeight: null,
    motherMode: null,
    bloodType: null,
  };
}