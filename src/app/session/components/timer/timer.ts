import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { pad } from '../../../common/function/pad-time.function';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-timer',
  imports: [MatMiniFabButton, MatIcon, MatCard, MatCardContent],
  templateUrl: './timer.html',
  styleUrl: './timer.css',
})
export class Timer {
  private readonly timer = signal(0);

  protected readonly displayValue = computed(() => {
    const timer = this.timer();
    const { hours, minutes, seconds } = Temporal.Duration.from({ seconds: timer }).round({
      largestUnit: 'hours',
    });
    return [hours, minutes, seconds].map((part) => pad(part)).join(':');
  });
  private readonly isRunning = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect((onCleanup) => {
      if (!this.isRunning()) return;

      const intervalId = setInterval(() => this.timer.update((current) => current + 1), 1000);
      onCleanup(() => clearInterval(intervalId));
    });
  }

  protected start(): void {
    this.isRunning.set(true);
  }

  protected pause(): void {
    this.isRunning.set(false);
  }

  protected reset(): void {
    this.timer.set(0);
    this.isRunning.set(false);
  }
}
