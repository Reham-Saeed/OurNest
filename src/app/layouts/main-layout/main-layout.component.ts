import { Component } from '@angular/core';
import { NavMainComponent } from "../../components/nav-main/nav-main.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout.component',
  imports: [NavMainComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {

}
