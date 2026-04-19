import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BabyService } from '../../core/services/baby/baby.service';
import { MotherService } from '../../core/services/mother/mother.service';
import { PeriodTrackerService } from '../../core/services/trackers/period-tracker.service';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { PregnancyService } from '../../core/services/pregnancy/pregnancy.service';
import { FatherService } from '../../core/services/father/father.service';
import { OnboardingService } from '../../core/services/onboarding/onboarding.service';

type Step =
  | 'role'
  | 'mother:isPregnant'
  | 'mother:pregnant:bodyDetails'
  | 'mother:pregnant:firstChild'
  | 'mother:pregnant:knownInfo'
  | 'mother:pregnant:lastPeriodDate'
  | 'mother:pregnant:gestationalAge'
  | 'mother:pregnant:expectedDueDate'
  | 'mother:pregnant:birthDate'
  | 'mother:notPregnant:isPlanning'
  | 'mother:notPregnant:planning'
  | 'mother:notPregnant:planning:periodSelect'
  | 'mother:notPregnant:notPlanning:isHasBaby'
  | 'mother:notPregnant:notPlanning:hasBaby:birthDate'
  | 'mother:notPregnant:notPlanning:hasBaby:gender'
  | 'mother:notPregnant:notPlanning:hasBaby:weight'
  | 'mother:notPregnant:notPlanning:hasBaby:name'
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
  currentView: 'planningForm' | 'lastPeriodSelect' = 'planningForm';

  constructor(
    private router: Router,
    private _MotherService: MotherService,
    private _FatherService: FatherService,
    private _OnboardingService: OnboardingService,
    private _PregnancyService: PregnancyService,
    private _BabyService: BabyService,
    private _PeriodTrackerService: PeriodTrackerService,
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('step');
    if (saved) this.currentStep = saved as Step;
  }

  formData: any = {
    role: null,
    isPregnant: false,
    height: null,
    weight: null,
    isFirstChild: false,
    knowledgeType: null,

    lastPeriodDate: null,
    gestationalWeeks: null,
    gestationalDays: null,
    expectedDueDate: null,

    birthDate: null,

    cycleLengthDays: null,
    periodLengthDays: null,

    babyBirthDate: null,
    babyGender: null,
    babyWeight: null,
    babyName: null,

    motherMode: null,
    bloodType: null,
  };

  periodDetails = new FormGroup({
    lastPeriodDate: new FormControl('', Validators.required),

    periodLength: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),

    cycleLength: new FormControl(null, [
      Validators.required,
      Validators.min(15),
      Validators.max(50),
    ]),
  });

  bodyDetails = new FormGroup({
    height: new FormControl(null, [Validators.required, Validators.min(120), Validators.max(220)]),
    weight: new FormControl(null, [Validators.required, Validators.min(35), Validators.max(200)]),
  });

  babyWeightForm = new FormGroup({
    babyWeight: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(18)]),
  });

  babyNameForm = new FormGroup({
    babyName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
    ]),
  });

  getCurrentForm(): FormGroup | null {
    switch (this.currentStep) {
      case 'mother:pregnant:bodyDetails':
        return this.bodyDetails;

      case 'mother:notPregnant:planning':
        return this.periodDetails;

      case 'mother:notPregnant:notPlanning:hasBaby:weight':
        return this.babyWeightForm;

      case 'mother:notPregnant:notPlanning:hasBaby:name':
        return this.babyNameForm;

      default:
        return null;
    }
  }
  saveCurrentForm() {
    const form = this.getCurrentForm();

    if (!form) return;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    switch (this.currentStep) {
      // ---------------- BODY DETAILS ----------------
      case 'mother:pregnant:bodyDetails':
        this.formData.height = form.value.height;
        this.formData.weight = form.value.weight;

        this.currentStep = 'mother:pregnant:firstChild';
        break;

      // ---------------- PERIOD DETAILS ----------------
      case 'mother:notPregnant:planning':
        this.formData.lastPeriodDate = form.value.lastPeriodDate;
        this.formData.periodLengthDays = form.value.periodLength;
        this.formData.cycleLengthDays = form.value.cycleLength;

        this.submitAll();
        return;

      // ---------------- BABY WEIGHT ----------------
      case 'mother:notPregnant:notPlanning:hasBaby:weight':
        this.formData.babyWeight = form.value.babyWeight;

        this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:name';
        break;

      // ---------------- BABY NAME ----------------
      case 'mother:notPregnant:notPlanning:hasBaby:name':
        this.formData.babyName = form.value.babyName;
        this.submitAll();
        return;
    }

    this.saveState();
  }

  // -----------------------
  // NAVIGATION
  // -----------------------

  pushHistory() {
    const last = this.history[this.history.length - 1];
    if (last !== this.currentStep) {
      this.history.push(this.currentStep);
    }
  }

  goBack() {
    if (this.history.length) {
      this.currentStep = this.history.pop()!;
      this.saveState();
    }
  }

  saveState() {
    localStorage.setItem('step', this.currentStep);
  }

  next() {
    this.pushHistory();

    switch (this.currentStep) {
      case 'mother:pregnant:lastPeriodDate':
      case 'mother:pregnant:gestationalAge':
      case 'mother:pregnant:expectedDueDate':
        this.currentStep = 'mother:pregnant:birthDate';
        break;

      case 'mother:pregnant:firstChild':
        this.currentStep = 'mother:pregnant:knownInfo';
        break;

      case 'father:birthDate':
        this.submitAll();
        return;

      case 'mother:notPregnant:notPlanning:hasBaby:birthDate':
        this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:gender';
        break;

      case 'mother:notPregnant:notPlanning:hasBaby:weight':
        this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:name';
        break;
    }

    this.saveState();
  }

  // -----------------------
  // CHOICES
  // -----------------------

  chooseRole(role: 'mother' | 'father') {
    this.pushHistory();
    this.formData.role = role;

    this.currentStep = role === 'mother' ? 'mother:isPregnant' : 'father:birthDate';

    this.saveState();
  }

  choosePregnant(val: boolean) {
    this.pushHistory();
    this.formData.isPregnant = val;
    this.formData.motherMode = val ? 'pregnant' : 'planning';

    this.currentStep = val ? 'mother:pregnant:bodyDetails' : 'mother:notPregnant:isPlanning';

    this.saveState();
  }

  selectFirstChild(val: boolean) {
    this.pushHistory();
    this.formData.isFirstChild = val;
    this.currentStep = 'mother:pregnant:knownInfo';
    this.saveState();
  }

  selectKnownInfo(type: string) {
    this.pushHistory();
    this.formData.knowledgeType = type;

    if (type === 'lastPeriod') {
      this.currentStep = 'mother:pregnant:lastPeriodDate';
    }
    if (type === 'pregnantAge') {
      this.currentStep = 'mother:pregnant:gestationalAge';
    }
    if (type === 'dueDate') {
      this.currentStep = 'mother:pregnant:expectedDueDate';
    }

    this.saveState();
  }

  onLastPeriodPicked(date: any) {
    const formattedDate = this.formatDate(date);
    this.periodDetails.patchValue({ lastPeriodDate: formattedDate });
  }
  onLastPeriodSelect(date: any) {
    this.formData.lastPeriodDate = this.formatDate(date);
  }
  openLastPeriodSelect() {
    this.currentView = 'lastPeriodSelect';
  }

  closeLastPeriodSelect() {
    this.currentView = 'planningForm';
  }

  onGestationalAgeSelect(gestationalAge: any) {
    this.formData.gestationalWeeks = gestationalAge.week;
    this.formData.gestationalDays = gestationalAge.day;
  }

  onExpectedDueDateSelect(date: any) {
    this.formData.expectedDueDate = this.formatDate(date);
  }

  onBirthDateSelect(date: any) {
    this.formData.birthDate = this.formatDate(date);
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
    } else {
      this.formData.motherMode = null;
      this.router.navigate(['notfound']);
    }

    this.saveState();
  }

  onBabyBirthDateSelect(date: any) {
    this.formData.babyBirthDate = this.formatDate(date);
  }

  selectBabyGender(val: string) {
    this.pushHistory();
    this.formData.babyGender = val;
    this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:weight';
    this.saveState();
  }

  selectBabyWeight(val: string) {
    this.pushHistory();
    this.formData.babyWeight = val;
    this.currentStep = 'mother:notPregnant:notPlanning:hasBaby:name';
    this.saveState();
  }

  selectBabyName(val: string) {
    this.pushHistory();
    this.formData.babyName = val;
    this.saveState();
  }

  private formatDate(date: { year: number; month: any; day: number }): string {
    const d = new Date(`${date.day} ${date.month} ${date.year}`);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // -----------------------
  // FINAL SUBMIT FLOW
  // -----------------------

  submitAll() {
    this.finalizeFlow().subscribe({
      next: () => {
        localStorage.removeItem('step');
        this.router.navigate(['/']);
      },
      error: (err: Error) => console.error(err),
    });
  }

  finalizeFlow() {
    const role$ = this.formData.role === 'father' ? this.submitFather() : this.submitMother();

    return role$.pipe(
      switchMap((res) => {
        return this.submitOnboarding();
      }),

      switchMap((res) => {
        return this.submitMotherExtraStep();
      }),
    );
  }

  submitMotherExtraStep() {
    if (this.formData.role !== 'mother') {
      return of(null);
    }

    if (this.formData.motherMode === 'planning') {
      return this.submitPeriod();
    }

    if (this.formData.motherMode === 'hasBaby') {
      return this.submitBaby();
    }

    return of(null);
  }

  submitFather() {
    const payload = {
      dateOfBirth: this.formData.birthDate,
    };

    return this._FatherService.createFather(payload);
  }

  submitMother() {
    if (this.formData.role !== 'mother') {
      return of(null);
    }

    const payload = {
      height: Number(this.formData.height),
      weight: Number(this.formData.weight),
      bloodType: this.formData.bloodType || null,
    };

    return this._MotherService.createMother(payload);
  }

  submitOnboarding() {
    const payload = {
      isDoctor: false,
      role: this.formData.role === 'mother' ? 'mother' : 'father',

      isPregnant: this.formData.isPregnant ?? false,

      height: this.formData.height ? Number(this.formData.height) : null,
      weight: this.formData.weight ? Number(this.formData.weight) : null,

      isFirstChild: this.formData.isFirstChild ?? null,
      knowledgeType: this.formData.knowledgeType ?? null,

      lastMenstrualDate: this.formData.lastPeriodDate ?? null,

      gestationalWeeks: this.formData.gestationalWeeks ?? null,
      gestationalDays: this.formData.gestationalDays ?? null,

      conceptionDate: this.formData.expectedDueDate ?? null,
      dateOfBirth: this.formData.birthDate ?? null,
    };

    return this._OnboardingService.submitOnboarding(payload);
  }

  submitPeriod() {
    if (this.formData.role !== 'mother') {
      return of(null);
    }

    if (this.formData.motherMode !== 'planning') {
      return of(null);
    }

    const cycleLength = Number(this.formData.cycleLengthDays);
    const periodLength = Number(this.formData.periodLengthDays);

    if (!cycleLength || !periodLength) {
      return of(null);
    }

    const payload = {
      startDate: this.formData.lastPeriodDate,
      cycleLengthDays: cycleLength,
      periodLengthDays: periodLength,
    };

    return this._PeriodTrackerService.addPeriod(payload);
  }

  submitBaby() {
    if (this.formData.role !== 'mother') {
      return of(null);
    }

    if (this.formData.motherMode !== 'hasBaby') {
      return of(null);
    }

    const payload = {
      name: this.formData.babyName,
      dateOfBirth: this.formData.birthDate,
      gender: this.formData.babyGender,
      birthWeight: Number(this.formData.babyWeight),
    };

    return this._BabyService.createBaby(payload);
  }
}