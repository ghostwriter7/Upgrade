import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-page',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
})
export default class SessionPage {
  public date = input.required<string>();

  protected readonly label = computed(() => Temporal.PlainDate.from(this.date()).toLocaleString('en-GB', { dateStyle: 'full' }));
  private readonly router = inject(Router);

  protected showPreviousDay(): void {
    const previousDate = Temporal.PlainDate.from(this.date()).subtract({ days: 1 }).toString();
    this.router.navigate(['/session', previousDate]);
  }

  protected showNextDay(): void {
    const nextDate = Temporal.PlainDate.from(this.date()).add({ days: 1 }).toString();
    this.router.navigate(['/session', nextDate]);
  }
}
