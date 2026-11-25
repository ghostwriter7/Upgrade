import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionList } from '../session-list/session-list';
import { DateHelper } from '@common/helper/date.helper';
import { SessionStore } from '@store/session/session.store';
import { EventService } from '@common/service/event/event.service';
import { SwipedEvent } from '@common/events/swiped.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-session-page',
  imports: [SessionList],
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export default class SessionPage {
  public date = input.required<Temporal.ZonedDateTime, string>({
    transform: DateHelper.toLocal,
  });

  protected readonly label = computed(() =>
    this.date().toLocaleString('en-GB', { dateStyle: 'full' }),
  );
  private readonly router = inject(Router);
  private readonly sessionStore = inject(SessionStore);
  private readonly eventService = inject(EventService);

  constructor() {
    effect(() => {
      const date = this.date();
      this.sessionStore.setActiveDate(date.toPlainDate().toString());
    });

    this.eventService.listen(SwipedEvent)
      .pipe(takeUntilDestroyed())
      .subscribe((e) => {
        if (e.direction === 'left') {
          this.showPreviousDay();
        } else {
          this.showNextDay();
        }
      })
  }

  private showPreviousDay(): void {
    const previousDate = this.date().subtract({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', previousDate]);
  }

  private showNextDay(): void {
    const nextDate = this.date().add({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', nextDate]);
  }
}
