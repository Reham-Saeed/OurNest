import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PregnancyService } from '../../core/services/pregnancy/pregnancy.service';
import { PartnerService } from '../../core/services/partner/partner.service';

interface WeekTip {
  id: string;
  title: string;
  content: string;
  category: 'Symptom' | 'Food' | 'Instruction';
  imageUrl: string | null;
  targetWeek: number;
}

@Component({
  selector: 'app-pregnancy-tracker.component',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './pregnancy-tracker.component.html',
  styleUrl: './pregnancy-tracker.component.scss',
})
export class PregnancyTrackerComponent {
  pregnancyData: any;

  week = 0;
  days = 0;
  trimester = '';
  progressPercent = 0;
  weeksLeft = 0;
  dueDate = '';

  weekTips: WeekTip[] = [];
  tipsLoading = false;

  categoryConfig: Record<string, { label: string; icon: string }> = {
    Symptom: { label: 'Expected Symptoms', icon: 'fa-solid fa-list-check' },
    Food: { label: 'Beneficial Foods', icon: 'fa-apple-whole' },
    Instruction: {
      label: 'Tips & Instructions',
      icon: 'fa-solid fa-hand-holding-medical',
    },
  };

  trimesterPills = [
    { label: '1st Trimester (Wks 1–12)', active: false },
    { label: '2nd Trimester (Wks 13–26)', active: false },
    { label: '3rd Trimester (Wks 27–40)', active: false },
  ];

  trimesterInfo: Record<
    string,
    { title: string; subtitle: string; weeks: string; images: string[] }
  > = {
    first: {
      title: 'First Trimester',
      subtitle: 'The beginning of your pregnancy journey',
      weeks: 'Weeks 1–12',
      images: [
        '/assets/first-trimester-1.png',
        '/assets/first-trimester-2.png',
      ],
    },
    second: {
      title: 'Second Trimester',
      subtitle: 'Often called the honeymoon phase',
      weeks: 'Weeks 13–26',
      images: [
        '/assets/second-trimester-1.png',
        '/assets/second-trimester-2.png',
      ],
    },
    third: {
      title: 'Third Trimester',
      subtitle: 'The final stretch before meeting your baby',
      weeks: 'Weeks 27–40',
      images: [
        '/assets/third-trimester-1.png',
        '/assets/third-trimester-2.png',
      ],
    },
  };

  currentTrimesterInfo = this.trimesterInfo['first'];

  constructor(
    private _PregnancyService: PregnancyService,
    private _PartnerService: PartnerService
  ) {}

  ngOnInit() {
    this.getPregnancyData();
  }

  get groupedTips() {
    const order = ['Symptom', 'Food', 'Instruction'];

    return order
      .map((cat) => ({
        category: cat,
        icon: this.categoryConfig[cat].icon,
        label: this.categoryConfig[cat].label,
        items: this.weekTips.filter((t) => t.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }

  loadPregnancy(data: any) {
    this.pregnancyData = data;

    this.week = data.currentWeek || 0;

    // عشان ميعديش 40 أسبوع
    const safeWeek = Math.min(this.week, 40);

    this.weeksLeft = Math.max(40 - safeWeek, 0);

    this.progressPercent = Math.min((safeWeek / 40) * 100, 100);

    if (data.dueDate) {
      this.dueDate = new Date(data.dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    if (safeWeek <= 12) {
      this.trimester = 'First Trimester';
      this.currentTrimesterInfo = this.trimesterInfo['first'];
    } else if (safeWeek <= 26) {
      this.trimester = 'Second Trimester';
      this.currentTrimesterInfo = this.trimesterInfo['second'];
    } else {
      this.trimester = 'Third Trimester';
      this.currentTrimesterInfo = this.trimesterInfo['third'];
    }

    this.trimesterPills = [
      {
        label: '1st Trimester (Wks 1–12)',
        active: safeWeek <= 12,
      },
      {
        label: '2nd Trimester (Wks 13–26)',
        active: safeWeek >= 13 && safeWeek <= 26,
      },
      {
        label: '3rd Trimester (Wks 27–40)',
        active: safeWeek >= 27,
      },
    ];

    this.getWeekTips(safeWeek);
  }

  getWeekTips(week: number) {
    this.tipsLoading = true;

    this._PregnancyService.getPregnancyTips(week).subscribe({
      next: (res: WeekTip[]) => {
        this.weekTips = res;
        this.tipsLoading = false;
      },
      error: (err) => {
        console.log('Error loading week tips', err);
        this.tipsLoading = false;
      },
    });
  }

  getPregnancyData() {
    this._PartnerService.getFamilyDashboard().subscribe({
      next: (res: any) => {
        const pregnancy = res?.babyData?.pregnancy;

        if (pregnancy) {
          this.loadPregnancy(pregnancy);
        }
      },
      error: (err) => {
        console.log('Error loading pregnancy data', err);
      },
    });
  }
}