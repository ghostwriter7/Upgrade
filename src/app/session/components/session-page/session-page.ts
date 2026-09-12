import { Component, computed, effect, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { SessionList } from '../session-list/session-list';
import { DateHelper } from '@common/helper/date.helper';
import { SessionStore } from '@store/session/session.store';

@Component({
  selector: 'app-session-page',
  imports: [MatIcon, MatMiniFabButton, SessionList],
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

  constructor() {
    effect(() => {
      const date = this.date();
      this.sessionStore.setActiveDate(date.toPlainDate().toString());
    });
  }

  protected showPreviousDay(): void {
    const previousDate = this.date().subtract({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', previousDate]);
  }

  protected showNextDay(): void {
    const nextDate = this.date().add({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', nextDate]);
  }
}
