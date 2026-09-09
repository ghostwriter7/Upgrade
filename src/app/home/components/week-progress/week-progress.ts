import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-week-progress',
  templateUrl: './week-progress.html',
  styleUrl: './week-progress.css',
  imports: [MatIcon, MatChip],
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

    const value = Math.round((elapsed / total) * 100);
    this.percentage.set(value);
  }
}
