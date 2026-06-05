import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lozenge',
  templateUrl: './lozenge.html',
  styleUrl: './lozenge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents;',
  },
})
export class Lozenge {}
