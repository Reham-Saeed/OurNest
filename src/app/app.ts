import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionsFlowComponent } from "./components/questions-flow/questions-flow.component";
import { HomeComponent } from "./components/home/home.component";

interface ScrollableHTMLElement extends HTMLElement {
  _scrollTimer?: ReturnType<typeof setTimeout>;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, QuestionsFlowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('OurNest');
  
}
