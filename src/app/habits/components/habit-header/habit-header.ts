import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-habit-header',
  imports: [],
  templateUrl: './habit-header.html',
  styleUrl: './habit-header.css',
})
export class HabitHeader {}
