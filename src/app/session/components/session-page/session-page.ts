import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionList } from '../session-list/session-list';
import { DateHelper } from '@common/helper/date.helper';
import { SessionStore } from '@store/session/session.store';

@Component({
  selector: 'app-session-page',
  imports: [SessionList],
  templateUrl: './session-page.html',
  styleUrl: './session-page.css',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'cancelSwipe()',
  },
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

  private readonly swipeThreshold = 60;

  private swipeStart: { pointerId: number; x: number; y: number } | null = null;

  constructor() {
    effect(() => {
      const date = this.date();
      this.sessionStore.setActiveDate(date.toPlainDate().toString());
    });
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'touch') {
      return;
    }

    if (!event.isPrimary) {
      this.cancelSwipe();
      return;
    }

    this.swipeStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  }

  protected onPointerUp(event: PointerEvent): void {
    const start = this.swipeStart;

    if (event.pointerId !== start?.pointerId) {
      return;
    }

    this.cancelSwipe();

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < this.swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) {
      return;
    }

    if (deltaX < 0) {
      this.showNextDay();
    } else {
      this.showPreviousDay();
    }
  }

  protected cancelSwipe(): void {
    this.swipeStart = null;
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
