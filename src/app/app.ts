import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
interface ScrollableHTMLElement extends HTMLElement {
  _scrollTimer?: ReturnType<typeof setTimeout>;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('OurNest');
  
}
