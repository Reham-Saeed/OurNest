import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-second-trimester',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './second-trimester.component.html',
  styleUrl: './second-trimester.component.scss',
})
export class SecondTrimesterComponent {}
