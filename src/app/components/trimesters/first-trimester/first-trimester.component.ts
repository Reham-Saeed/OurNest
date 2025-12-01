import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-first-trimester',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './first-trimester.component.html',
  styleUrl: './first-trimester.component.scss',
})
export class FirstTrimesterComponent {}
