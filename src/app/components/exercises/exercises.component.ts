import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BabyService } from '../../core/services/baby/baby.service';
import { AppStateService } from '../../core/services/app-state/app-state.service';
import { PartnerService } from '../../core/services/partner/partner.service';

interface ExerciseVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  safeUrl?: SafeResourceUrl;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

type AppState = {
  isPregnant: boolean;
  hasBaby: boolean;
};

type ActiveTab = 'pregnancy' | 'baby';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private _PartnerService = inject(PartnerService);
  private appStateService = inject(AppStateService);

  isPregnant = false;
  hasBaby = false;
  activeTab: ActiveTab = 'baby';
  showTabs = false;

  babyMonth = 1;
  searchQuery = '';

  currentVideoIndex = 0;
  currentVideo!: ExerciseVideo;

  // ============ PREGNANCY VIDEOS ============
  pregnancyVideos: ExerciseVideo[] = [
    {
      id: 1,
      title: 'Prenatal Yoga | 22-Min Home Practice (All Trimesters)',
      description:
        'Gentle prenatal yoga by Yoga With Adriene, suitable for all levels and trimesters.',
      thumbnail: 'https://i.ytimg.com/vi/-3bvlFKeLRE/maxresdefault.jpg',
      youtubeId: '-3bvlFKeLRE',
    },
    {
      id: 2,
      title: '35-Min Prenatal Cardio + Mobility (No Equipment)',
      description: 'Low impact prenatal cardio and mobility workout safe for all trimesters.',
      thumbnail: 'https://i.ytimg.com/vi/EpCO4vCNM_E/maxresdefault.jpg',
      youtubeId: 'EpCO4vCNM_E',
    },
    {
      id: 3,
      title: '20-Min Pregnancy Walking Cardio (No Squats / No Lunges)',
      description: 'Indoor walking workout for pregnancy, mostly standing, no equipment needed.',
      thumbnail: 'https://i.ytimg.com/vi/Qd4QBIoKrJM/maxresdefault.jpg',
      youtubeId: 'Qd4QBIoKrJM',
    },
    {
      id: 4,
      title: '15-Min Low Impact HIIT Cardio (No Jumping)',
      description: '9 pregnancy-safe cardio exercises, no jumping, safe for all trimesters.',
      thumbnail: 'https://i.ytimg.com/vi/l7vwhSo3040/maxresdefault.jpg',
      youtubeId: 'l7vwhSo3040',
    },
    {
      id: 5,
      title: '30-Min Pregnancy Strength Training (All Trimesters)',
      description:
        '8 of the best pregnancy exercises combined in a full body strength workout at home.',
      thumbnail: 'https://i.ytimg.com/vi/dnE4ZqXrc5k/maxresdefault.jpg',
      youtubeId: 'dnE4ZqXrc5k',
    },
    {
      id: 6,
      title: '20-Min Second Trimester Strength Workout',
      description:
        'Beginner-friendly full body strength workout designed for the second trimester.',
      thumbnail: 'https://i.ytimg.com/vi/pNGv3_4N_94/maxresdefault.jpg',
      youtubeId: 'pNGv3_4N_94',
    },
    {
      id: 7,
      title: '20-Min Third Trimester Strength Workout (Dumbbells)',
      description:
        'Full body strength workout with dumbbells to stay strong in the third trimester.',
      thumbnail: 'https://i.ytimg.com/vi/XNF2nfPu9rg/maxresdefault.jpg',
      youtubeId: 'XNF2nfPu9rg',
    },
    {
      id: 8,
      title: 'Pelvic Floor Exercises For Pregnant Women (Kegels)',
      description: 'Daily pregnancy kegels routine for easier birth and faster recovery.',
      thumbnail: 'https://i.ytimg.com/vi/z8ik-Oje-k4/maxresdefault.jpg',
      youtubeId: 'z8ik-Oje-k4',
    },
    {
      id: 9,
      title: '10-Min Pelvic Floor Workout for Labor & Delivery Prep',
      description: 'Targeted pelvic floor and core workout to prepare your body for labor.',
      thumbnail: 'https://i.ytimg.com/vi/_NuvqZG2bDI/maxresdefault.jpg',
      youtubeId: '_NuvqZG2bDI',
    },
  ];

  // ============ BABY VIDEOS ============
  babyVideos: ExerciseVideo[] = [
    {
      id: 1,
      title: 'Baby Sleep Basics',
      description: 'Essential sleep tips for newborns from birth to 3 months.',
      thumbnail: 'https://i.ytimg.com/vi/se00vkpziuU/sddefault.jpg',
      youtubeId: 'se00vkpziuU',
    },

    {
      id: 2,
      title: 'Night Time Routine',
      description:
        'See what a full night with a 2-week-old looks like, including breastfeeding and soothing tips.',
      thumbnail: 'https://i.ytimg.com/vi/gnYxGcHNDaQ/maxresdefault.jpg',
      youtubeId: 'gnYxGcHNDaQ',
    },
    {
      id: 3,
      title: 'Newborn Care 101',
      description:
        'A comprehensive guide on swaddling, diaper changes, and keeping your newborn happy.',
      thumbnail: 'https://i.ytimg.com/vi/5bjr7DgN_nk/maxresdefault.jpg',
      youtubeId: '5bjr7DgN_nk',
    },

    {
      id: 4,
      title: 'How to Bathe a Newborn',
      description: 'A step-by-step walkthrough on safe bathing techniques and cord care.',
      thumbnail: 'https://i.ytimg.com/vi/Tyo_edfArX8/maxresdefault.jpg',
      youtubeId: 'Tyo_edfArX8',
    },
    {
      id: 5,
      title: 'Newborn Care Guide',
      description:
        'Covers the EASY method (Eat, Awake, Sleep, You time) and managing common issues.',
      thumbnail: 'https://i.ytimg.com/vi/mvkumrNrtSU/maxresdefault.jpg',
      youtubeId: 'mvkumrNrtSU',
    },
    {
      id: 6,
      title: 'Promoting Development',
      description: 'Learn how to boost your baby brain growth through interaction.',
      thumbnail: 'https://i.ytimg.com/vi/2vqhTU16Dr4/maxresdefault.jpg',
      youtubeId: '2vqhTU16Dr4',
    },
    {
      id: 7,
      title: 'The First 24 Hours',
      description:
        'What to expect immediately after birth, including initial feedings and bonding.',
      thumbnail: 'https://i.ytimg.com/vi/P5k3nn5JK5k/maxresdefault.jpg',
      youtubeId: 'P5k3nn5JK5k',
    },
  ];

  babyFaqs: FAQ[] = [
    {
      question: '1- How long should I keep my baby on their tummy?',
      answer: 'Start with 3-5 minutes, 2-3 times a day.',
      isOpen: false,
    },
    {
      question: '2- What should I do if my baby starts to cry?',
      answer: 'Pick them up, soothe them, and try again later.',
      isOpen: false,
    },
    {
      question: '3- What is the best surface for tummy time?',
      answer: 'A firm, flat surface like a play mat on the floor.',
      isOpen: false,
    },
  ];

  pregnancyFaqs: FAQ[] = [
    {
      question: '1- Is it safe to exercise during pregnancy?',
      answer:
        'Yes, moderate exercise is generally safe and beneficial. Always consult your doctor first.',
      isOpen: false,
    },
    {
      question: '2- What exercises should I avoid while pregnant?',
      answer:
        'Avoid lying flat on your back after the first trimester, contact sports, and heavy weightlifting.',
      isOpen: false,
    },
    {
      question: '3- How often should I do prenatal exercises?',
      answer: 'Aim for 30 minutes of moderate activity most days of the week.',
      isOpen: false,
    },
  ];

  get faqs(): FAQ[] {
    return this.activeTab === 'pregnancy' ? this.pregnancyFaqs : this.babyFaqs;
  }

  ngOnInit() {
    this.loadAppState();
    this.sanitizeVideoUrls(this.babyVideos);
    this.sanitizeVideoUrls(this.pregnancyVideos);
    this.initCurrentVideo();

    if (this.hasBaby) {
      this.loadBabyData();
    }
  }

  private loadAppState(): void {
    const state = this.appStateService.getLocalState();

    this.isPregnant = state?.mode === 'pregnancy';
    this.hasBaby = state?.mode === 'babycare';

    this.showTabs = this.isPregnant && this.hasBaby;

    if (this.showTabs) {
      this.activeTab = 'baby';
    } else if (this.isPregnant) {
      this.activeTab = 'pregnancy';
    } else {
      this.activeTab = 'baby';
    }
  }

  private sanitizeVideoUrls(videos: ExerciseVideo[]): void {
    videos.forEach((video) => {
      const url = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`;
      video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  private initCurrentVideo(): void {
    const list = this.activeVideos;
    if (list.length > 0) {
      this.currentVideo = list[0];
      this.currentVideoIndex = 0;
    }
  }

  loadBabyData(): void {
    this._PartnerService.getFamilyDashboard().subscribe({
      next: (res: any) => {
        const baby = res?.babyData?.babies?.[0];

        if (!baby) return;

        const dob = new Date(baby.dateOfBirth);

        const diffDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));

        this.babyMonth = Math.max(1, Math.floor(diffDays / 30));
      },

      error: (err) => {
        console.error('Failed to load baby from family dashboard', err);
        this.babyMonth = 2;
      },
    });
  }

  switchTab(tab: ActiveTab): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.initCurrentVideo();
  }

  get activeVideos(): ExerciseVideo[] {
    return this.activeTab === 'pregnancy' ? this.pregnancyVideos : this.babyVideos;
  }

  get filteredVideos(): ExerciseVideo[] {
    const list = this.activeVideos;
    if (!this.searchQuery.trim()) return list;
    const query = this.searchQuery.toLowerCase();
    return list.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query),
    );
  }

  selectVideo(video: ExerciseVideo): void {
    this.currentVideo = video;
    this.currentVideoIndex = this.activeVideos.findIndex((v) => v.id === video.id);
  }

  nextVideo(): void {
    const list = this.activeVideos;
    if (this.currentVideoIndex < list.length - 1) {
      this.selectVideo(list[this.currentVideoIndex + 1]);
    }
  }

  prevVideo(): void {
    if (this.currentVideoIndex > 0) {
      this.selectVideo(this.activeVideos[this.currentVideoIndex - 1]);
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
