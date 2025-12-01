import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-third-trimester',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './third-trimester.component.html',
  styleUrl: './third-trimester.component.scss',
})
export class ThirdTrimesterComponent {}
