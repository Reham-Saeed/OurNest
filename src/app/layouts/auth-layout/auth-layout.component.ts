import { Component } from '@angular/core';
import { NavAuthComponent } from '../../components/nav-auth/nav-auth.component';
import { RouterOutlet } from '@angular/router';
import { NavMainComponent } from '../../components/nav-main/nav-main.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NavAuthComponent,NavMainComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
