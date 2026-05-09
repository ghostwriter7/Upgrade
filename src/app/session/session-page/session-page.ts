import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { SessionCarousel } from '../session-carousel/session-carousel';
import { SessionCalendar } from '../session-calendar/session-calendar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-page',
  imports: [MatButtonToggleGroup, MatButtonToggle, SessionCarousel, SessionCalendar],
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export default class SessionPage {
  protected readonly viewMode = signal<'carousel' | 'calendar'>('carousel');
}
