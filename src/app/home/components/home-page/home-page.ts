import { Component } from '@angular/core';
import { SessionCalendar } from '../session-calendar/session-calendar';

@Component({
  selector: 'app-home-page',
  imports: [SessionCalendar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
