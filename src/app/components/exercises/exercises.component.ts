import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BabyService } from '../../core/services/baby/baby.service'; 

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

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private babyService = inject(BabyService);

  babyMonth = 1;

  searchQuery = '';

  videos: ExerciseVideo[] = [
    {
      id: 1,
      title: 'Newborn Care 101',
      description: 'A comprehensive guide on swaddling, diaper changes, and keeping your newborn happy.',
      thumbnail: 'https://i.ytimg.com/vi/5bjr7DgN_nk/maxresdefault.jpg',
      youtubeId: '5bjr7DgN_nk'
    },
    {
      id: 2,
      title: 'Night Time Routine',
      description: 'See what a full night with a 2-week-old looks like, including breastfeeding and soothing tips.',
      thumbnail: 'https://i.ytimg.com/vi/gnYxGcHNDaQ/maxresdefault.jpg',
      youtubeId: 'gnYxGcHNDaQ'
    },
    {
      id: 3,
      title: 'Baby Sleep Basics',
      description: 'Essential sleep tips for newborns from birth to 3 months to help them distinguish day from night.',
      thumbnail: 'https://i.ytimg.com/vi/se00vkpziuU/sddefault.jpg',
      youtubeId: 'se00vkpziuU'
    },
    {
      id: 4,
      title: 'How to Bathe a Newborn',
      description: 'A step-by-step walkthrough on safe bathing techniques, cord care, and making bath time enjoyable.',
      thumbnail: 'https://i.ytimg.com/vi/Tyo_edfArX8/maxresdefault.jpg',
      youtubeId: 'Tyo_edfArX8'
    },
    {
      id: 5,
      title: 'Newborn Care Guide',
      description: 'Covers the EASY method (Eat, Awake, Sleep, You time) and managing common issues like gas and colic.',
      thumbnail: 'https://i.ytimg.com/vi/mvkumrNrtSU/maxresdefault.jpg',
      youtubeId: 'mvkumrNrtSU'
    },
    {
      id: 6,
      title: 'Promoting Development',
      description: 'Learn how to use your voice, touch, and face-to-face interaction to boost your baby’s brain growth.',
      thumbnail: 'https://i.ytimg.com/vi/2vqhTU16Dr4/maxresdefault.jpg',
      youtubeId: '2vqhTU16Dr4'
    },
    {
      id: 7,
      title: 'The First 24 Hours',
      description: 'What to expect immediately after birth, including initial feedings and skin-to-skin bonding.',
      thumbnail: 'https://i.ytimg.com/vi/P5k3nn5JK5k/maxresdefault.jpg',
      youtubeId: 'P5k3nn5JK5k'
    }
  ];

  currentVideoIndex = 0;
  currentVideo!: ExerciseVideo;

  // Dummy Data for FAQs
  faqs: FAQ[] = [
    { question: '1- How long should i keep my baby on their tummy?', answer: 'Start with 3-5 minutes, 2-3 times a day.', isOpen: false },
    { question: '2- What should i do if my baby starts to cry?', answer: 'Pick them up, soothe them, and try again later. Do not force it.', isOpen: false },
    { question: '3- What is the best surface for tummy time?', answer: 'A firm, flat surface like a play mat on the floor.', isOpen: false }
  ];

  ngOnInit() {
    this.loadBabyData();

    this.videos.forEach(video => {
      const url = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`;
      video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
    
    this.currentVideo = this.videos[0];
  }

  loadBabyData() {
    this.babyService.getAllBabies().subscribe({
      next: (babies) => {
        if (babies && babies.length > 0) {
          const baby = babies[0];
          const dob = new Date(baby.dateOfBirth);
          const diffDays = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
          this.babyMonth = Math.max(1, Math.floor(diffDays / 30));
        }
      },
      error: (err) => {
        console.error('Failed to load baby profile', err);
        this.babyMonth = 2; 
      }
    });
  }

  get filteredVideos(): ExerciseVideo[] {
    if (!this.searchQuery.trim()) {
      return this.videos;
    }
    const query = this.searchQuery.toLowerCase();
    return this.videos.filter(video => 
      video.title.toLowerCase().includes(query) || 
      video.description.toLowerCase().includes(query)
    );
  }

  selectVideo(video: ExerciseVideo) {
    this.currentVideo = video;
    this.currentVideoIndex = this.videos.findIndex(v => v.id === video.id);
  }

  nextVideo() {
    if (this.currentVideoIndex < this.videos.length - 1) {
      this.selectVideo(this.videos[this.currentVideoIndex + 1]);
    }
  }

  prevVideo() {
    if (this.currentVideoIndex > 0) {
      this.selectVideo(this.videos[this.currentVideoIndex - 1]);
    }
  }

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}