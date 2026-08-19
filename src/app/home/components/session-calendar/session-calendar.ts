import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SessionCalendarService } from './session-calendar.service';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-calendar',
  imports: [MatIcon, MatMiniFabButton, RouterLink, NgClass],
  templateUrl: './session-calendar.html',
  styleUrl: './session-calendar.css',
})
export class SessionCalendar {
  private readonly sessionCalendarService = inject(SessionCalendarService);

  private readonly firstDayOfMonth = this.sessionCalendarService.$firstDayOfMonth;

  protected readonly label = computed(() =>
    this.firstDayOfMonth().toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
  );
  protected readonly calendarCells = this.sessionCalendarService.$calendarCells;

  protected showNextMonth(): void {
    this.sessionCalendarService.showNextMonth();
  }

  protected showPreviousMonth(): void {
    this.sessionCalendarService.showPreviousMonth();
  }
}
