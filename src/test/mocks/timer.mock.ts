import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-timer',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<p>Timer</p>',
})
export class TimerMock {}
