import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { SessionList } from '../session-list/session-list';
import { DateHelper } from '../../common/helper/date.helper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-page',
  imports: [MatIcon, MatMiniFabButton, SessionList],
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export default class SessionPage {
  public date = input.required<TemporalType.ZonedDateTime, string>(
    { transform: (value) => Temporal.PlainDate.from(value).toZonedDateTime(DateHelper.WARSAW_TIMEZONE)}
  );

  protected readonly label = computed(() =>
    this.date().toLocaleString('en-GB', { dateStyle: 'full' }),
  );
  private readonly router = inject(Router);

  protected showPreviousDay(): void {
    const previousDate = this.date().subtract({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', previousDate]);
  }

  protected showNextDay(): void {
    const nextDate = this.date().add({ days: 1 }).toPlainDate().toString();
    this.router.navigate(['/session', nextDate]);
  }
}
