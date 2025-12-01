import { Component } from '@angular/core';
import { OurServicesComponent } from "../our-services/our-services.component";
import { PregnancyTipsComponent } from "../pregnancy-tips/pregnancy-tips.component";
import { HeroComponent } from "../hero/hero.component";

@Component({
  selector: 'app-home',
  imports: [ OurServicesComponent, PregnancyTipsComponent, HeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

}
