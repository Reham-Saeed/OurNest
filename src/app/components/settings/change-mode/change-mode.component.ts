import { DatePipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { Router } from '@angular/router';
import { BabyService } from '../../../core/services/baby/baby.service';
import { AppState, AppStateService } from '../../../core/services/app-state/app-state.service';
import { OnboardingService } from '../../../core/services/onboarding/onboarding.service';
import { PartnerService } from '../../../core/services/partner/partner.service';
import { PeriodTrackerService } from '../../../core/services/trackers/period-tracker.service';
import { PregnancyService } from '../../../core/services/pregnancy/pregnancy.service';

@Component({
  selector: 'app-change-mode',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-mode.component.html',
  styleUrl: './change-mode.component.scss',
})
export class ChangeModeComponent {
  constructor(
    private router: Router,
    private _PeriodTrackerService: PeriodTrackerService,
    private _BabyService: BabyService,
    private _OnboardingService: OnboardingService,
    private _PregnancyService: PregnancyService,
    private _PartnerService: PartnerService,
    private _AppStateService: AppStateService,
  ) {}

  // ========================
  // STATE
  // =========================
  stateType: any;
  stateRole: 'Mother' | 'Father' = 'Mother';

  data: any = {};
  modes: any[] = [];

  activeModalKey: string | null = null;
  pendingModeKey: string | null = null;

  // =========================
  // INIT
  // =========================

  ngOnInit() {
    this._AppStateService.state$.subscribe((state) => {
      if (!state) return;
      if (state.role === 'Father') {
        return;
      }
      this.stateType = state?.mode;
      this.stateRole = state?.role;

      this.loadData(state);
      this.buildModes(state);
    });
  }

  // =========================
  // DATA
  // =========================
  loadData(state: any) {
    if (state.mode === 'pregnancy') {
      this.getPregnancyData();
    }

    if (state.mode === 'babycare') {
      this.getBabyData();
    }

    if (state.mode === 'planning') {
      this.getPlanningData();
    }
  }

  getPregnancyData() {
    this._OnboardingService.getOnboarding().subscribe((res: any) => {
      if (!res) return;

      this.data = {
        lastPeriod: this.formatDate(res.lastMenstrualDate),
        conceptionDate: this.formatDate(res.conceptionDate),
        laborDate: `${res.gestationalWeeks} weeks + ${res.gestationalDays} days`,
      };
    });
  }

  getBabyData() {
    this._PartnerService.getFamilyDashboard().subscribe((res: any) => {
      const baby = res?.babyData?.babies?.[0];
      if (!baby) return;

      this.data = {
        babyName: baby.name,
        birthDate: this.formatDate(baby.dateOfBirth),
        babyGender: baby.gender.toLowerCase(),
      };
    });
  }

  getPlanningData() {
    this._PeriodTrackerService.getPeriods().subscribe((res: any[]) => {
      if (!res?.length) return;

      const period = res[0];

      this.data = {
        lastPeriod: this.formatDate(period.startDate),
        periodLength: period.periodLengthDays + ' days',
        cycleLength: period.cycleLengthDays + ' days',
      };
    });
  }

  formatDate(date: string) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // =========================
  // MODES
  // =========================
  buildModes(state: any) {
    this.modes = [];

    if (state.mode === 'pregnancy') {
      this.modes = [
        { key: 'pregnancy_to_childbirth', title: 'Switch to childbirth mode' },
        { key: 'pregnancy_to_planning', title: 'Trying to conceive' },
      ];
    }

    if (state.mode === 'babycare') {
      this.modes = [
        { key: 'child_to_pregnancy', title: 'Switch to pregnancy mode' },
        { key: 'child_to_planning', title: 'Trying to conceive' },
      ];
    }

    if (state.mode === 'planning') {
      this.modes = [
        { key: 'planning_to_pregnancy', title: 'Switch to pregnancy mode' },
        { key: 'planning_to_child', title: 'Switch to childbirth mode' },
      ];
    }
  }

  // =========================
  // SWITCH
  // =========================
  onModeToggle(mode: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;

    checkbox.checked = false;

    this.pendingModeKey = mode.key;
    this.activeModalKey = mode.key;
  }

  // =========================
  // MODAL
  // =========================
  cancelModal() {
    this.activeModalKey = null;
    this.pendingModeKey = null;
  }

  confirmModal() {
    if (!this.pendingModeKey) return;

    switch (this.pendingModeKey) {
      case 'pregnancy_to_childbirth':
        this.endPregnancyFlow('child');
        break;

      case 'pregnancy_to_planning':
        this.endPregnancyFlow('planning');
        break;

      case 'child_to_planning':
        this.endBabyFlow('planning');
        break;

      case 'child_to_pregnancy':
        this.endBabyFlow('pregnancy');
        break;

      case 'planning_to_pregnancy':
        this.endPlanningFlow('pregnancy');
        break;

      case 'planning_to_child':
        this.endPlanningFlow('child');
        break;
    }

    this.activeModalKey = null;
    this.pendingModeKey = null;
  }

  // =========================
  // FLOWS (API + NAV)
  // =========================
  endPregnancyFlow(target: 'planning' | 'child') {
    this._PregnancyService.endPregnancy().subscribe({
      next: () => {
        this.setOnboardingContext(target);
        this.router.navigate(['/questions-flow']);
      },
      error: (err) => console.error(err),
    });
  }

  endBabyFlow(target: 'planning' | 'pregnancy') {
    const babyId = localStorage.getItem('babyId');

    if (!babyId) return;

    this._BabyService.deleteBaby(babyId).subscribe({
      next: () => {
        localStorage.removeItem('babyId');
        this.setOnboardingContext(target);
        this.router.navigate(['/questions-flow']);
      },
      error: (err) => console.error(err),
    });
  }

  endPlanningFlow(target: 'pregnancy' | 'child') {
    this.setOnboardingContext(target);
    this.router.navigate(['/questions-flow']);
  }

  // =========================
  // HELPER
  // =========================
  private setOnboardingContext(target: 'pregnancy' | 'child' | 'planning') {
    const map: any = {
      pregnancy: {
        role: 'Mother',
        motherMode: 'pregnancy',
        skipMotherCreation: true,
        resumeStep: 'mother:pregnant:bodyDetails',
      },

      child: {
        role: 'Mother',
        motherMode: 'hasBaby',
        skipMotherCreation: true,
        resumeStep: 'mother:notPregnant:notPlanning:hasBaby:birthDate',
      },

      planning: {
        role: 'Mother',
        motherMode: 'planning',
        skipMotherCreation: true,
        resumeStep: 'mother:notPregnant:planning',
      },
    };

    localStorage.setItem('onboarding-context', JSON.stringify(map[target]));
  }

  modalContent: any = {
    pregnancy_to_childbirth: {
      title: 'You’re switching to Childbirth mode',
      desc: 'It help you care for your child up to the age of two and helps you learn everything about your child’s health. Would you like to switch?',
    },
    pregnancy_to_planning: {
      title: 'You’re switching to Trying to conceive',
      desc: 'Health insights and cycle tracking tools can help you find your most fertile days. Do you want to continue?',
    },

    child_to_pregnancy: {
      title: "You're switching to Pregnancy mode",
      desc: 'It helps you track your journey week by week, from the first trimester all the way to delivery. Expert advice at every stage. Ready to continue?',
    },
    child_to_planning: {
      title: 'You’re switching to Trying to conceive',
      desc: 'Health insights and cycle tracking tools can help you find your most fertile days. Do you want to continue?',
    },

    planning_to_pregnancy: {
      title: "You're switching to Pregnancy mode",
      desc: 'It helps you track your journey week by week, from the first trimester all the way to delivery. Expert advice at every stage. Ready to continue?',
    },
    planning_to_child: {
      title: 'You’re switching to Childbirth mode',
      desc: 'It help you care for your child up to the age of two and helps you learn everything about your child’s health. Would you like to switch?',
    },
  };
}
