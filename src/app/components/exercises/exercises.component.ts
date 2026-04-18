import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  searchQuery = '';

  // Dummy Data for the Videos
  videos: ExerciseVideo[] = [
    {
      id: 1,
      title: 'Tummy Time 1',
      description: 'A guide to supporting you in how to deal with your child and do beneficial exercises for your child.',
      thumbnail: '/assets/family.jpg', // Replace with real image
      youtubeId: '8TqfVzFkpoM' // Example YouTube Video ID
    },
    {
      id: 2,
      title: 'Tummy Time 2',
      description: 'Advanced tummy time techniques for month 2.',
      thumbnail: 'assets/tummy-time-thumb.jpg',
      youtubeId: 'dQw4w9WgXcQ' 
    },
    {
      id: 3,
      title: 'Tummy Time 3',
      description: 'How to make tummy time fun and engaging.',
      thumbnail: 'assets/tummy-time-thumb.jpg',
      youtubeId: 'tPEE9ZwTmy0'
    }
  ];


  

  currentVideoIndex = 0;
  currentVideo!: ExerciseVideo;

  // Dummy Data for FAQs
  faqs: FAQ[] = [
    { question: '1- How long should i keep my baby on thier tummy?', answer: 'Start with 3-5 minutes, 2-3 times a day.', isOpen: false },
    { question: '2- What should i do if my baby starts to cry?', answer: 'Pick them up, soothe them, and try again later. Do not force it.', isOpen: false },
    { question: '3- What is the best surface for tummy time?', answer: 'A firm, flat surface like a play mat on the floor.', isOpen: false }
  ];

  ngOnInit() {
    // We must sanitize the YouTube URLs before displaying them
    this.videos.forEach(video => {
      // ?rel=0 prevents random recommended videos at the end
      const url = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`;
      video.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
    
    this.currentVideo = this.videos[0];
  }

// 1. ADD THIS GETTER: It magically filters the list based on what they type!
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

// 2. UPDATE THIS METHOD: Pass the actual video object, not the list index
selectVideo(video: ExerciseVideo) {
  this.currentVideo = video;
  // We update the index based on the original array so Next/Prev buttons still work perfectly
  this.currentVideoIndex = this.videos.findIndex(v => v.id === video.id);
}

nextVideo() {
  if (this.currentVideoIndex < this.videos.length - 1) {
    // Pass the actual video object from the array, not just the number!
    this.selectVideo(this.videos[this.currentVideoIndex + 1]);
  }
}

prevVideo() {
  if (this.currentVideoIndex > 0) {
    // Pass the actual video object from the array, not just the number!
    this.selectVideo(this.videos[this.currentVideoIndex - 1]);
  }
}

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}