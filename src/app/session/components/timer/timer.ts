import { Component, computed, effect, input, linkedSignal, model, signal } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { pad } from '@common/function/pad-time.function';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timer',
  imports: [
    MatMiniFabButton,
    MatIcon,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatFabButton,
    FormsModule,
    MatInput,
  ],
  templateUrl: './timer.html',
  styleUrl: './timer.css',
  host: {
    '[class.expanded]': 'isExpanded()',
  },
})
export class Timer {
  public showControls = input(true);
  public autoPlay = input(false);

  protected readonly controlsVisible = computed(
    () => this.showControls() && !this.isDurationTimerRunning(),
  );
  private readonly timer = signal(0);

  protected readonly isExpanded = signal(false);
  protected readonly displayValue = computed(() => {
    const timer = this.timer();
    const { hours, minutes, seconds, milliseconds } = Temporal.Duration.from({
      milliseconds: timer,
    }).round({
      largestUnit: 'hours',
    });
    return (
      this.isDurationTimerRunning()
        ? [hours, minutes, seconds, Math.floor(milliseconds / 10)]
        : [hours, minutes, seconds]
    )
      .map(pad)
      .join(':');
  });
  private readonly isRunning = linkedSignal(this.autoPlay);
  protected readonly duration = model(0);
  protected readonly toggleIcon = computed(() =>
    this.isExpanded() ? 'collapse_all' : 'expand_all',
  );
  private readonly direction = signal<1 | -1>(1);
  protected readonly isDurationTimerRunning = signal(false);

  constructor() {
    let intervalId: number | undefined;
    effect((onCleanup) => {
      if (!this.isRunning()) return;

      if (intervalId) clearInterval(intervalId);

      const timeout = this.isDurationTimerRunning() ? 10 : 1000;
      const direction = this.direction();
      intervalId = setInterval(
        () => this.timer.update((current) => current + direction * timeout),
        timeout,
      );
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

  protected toggle(): void {
    this.isExpanded.update((current) => !current);
  }

  protected cancelDurationTimer(): void {
    this.resetState();
  }

  protected async startDurationTimer(): Promise<void> {
    if (this.isDurationTimerRunning()) return;

    const durationMs = this.duration() * 1000;
    if (!durationMs) return;

    this.isDurationTimerRunning.set(true);

    this.direction.set(-1);
    this.timer.set(durationMs);
    const beep = this.getBeep();

    for (let countdown = 5; countdown > 0; countdown--) {
      if (!(await this.sleepUnlessCancelled(1000))) return;

      beep(countdown === 1 ? 660 : 880, countdown === 1 ? 120 : 100);
    }

    this.isRunning.set(true);

    if (!(await this.sleepUnlessCancelled(durationMs / 2))) return;
    beep(660, 120);

    if (!(await this.sleepUnlessCancelled(durationMs / 2 - 3000))) return;

    for (let i = 0; i < 3; i++) {
      beep();
      if (!(await this.sleepUnlessCancelled(1000))) return;
    }

    beep(440, 300);

    this.resetState();
  }

  private resetState(): void {
    this.isRunning.set(false);
    this.timer.set(0);
    this.direction.set(1);
    this.isDurationTimerRunning.set(false);
  }

  private async sleepUnlessCancelled(value: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, value));
    return this.isDurationTimerRunning();
  }

  private getBeep(): (frequency?: number, durationMs?: number, volume?: number) => void {
    const audioContext = new AudioContext();

    return (frequency = 880, durationMs = 100, volume = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gain.gain.value = volume;

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(audioContext.currentTime + durationMs / 1000);
    };
  }
}
