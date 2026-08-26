import { Component, OnInit, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-week-progress',
  templateUrl: './week-progress.html',
  styleUrl: './week-progress.css',
  imports: [MatProgressBar, MatIcon],
})
export class WeekProgress implements OnInit {
  protected readonly percentage = signal<number>(0);

  public ngOnInit(): void {
    const timeZone = Temporal.Now.timeZoneId();

    const now = Temporal.Now.zonedDateTimeISO(timeZone);
    const todayStart = now.startOfDay();

    const weekStart = todayStart.subtract({ days: todayStart.dayOfWeek - 1 });

    const nextWeekStart = weekStart.add({ weeks: 1 });

    const elapsed = now.toInstant().epochMilliseconds - weekStart.toInstant().epochMilliseconds;

    const total =
      nextWeekStart.toInstant().epochMilliseconds - weekStart.toInstant().epochMilliseconds;

    this.percentage.set((elapsed / total) * 100);
  }
}
