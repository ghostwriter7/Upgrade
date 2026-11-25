import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionCalendarService } from './session-calendar.service';
import { EventService } from '@common/service/event/event.service';
import { SwipedEvent } from '@common/events/swiped.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-session-calendar',
  imports: [RouterLink],
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
  private readonly eventService = inject(EventService);

  constructor() {
    this.eventService.listen(SwipedEvent)
      .pipe(takeUntilDestroyed())
      .subscribe((e) => {
        if (e.direction === 'left') {
          this.sessionCalendarService.showPreviousMonth();
        } else {
          this.sessionCalendarService.showNextMonth();
        }
      });
  }
}
