import { Component } from '@angular/core';
import { LayoutComponent } from './ui/layout/layout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [LayoutComponent],
})
export class App {}
