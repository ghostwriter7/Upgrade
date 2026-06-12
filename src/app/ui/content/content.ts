import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet],
  templateUrl: './content.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './content.css',
})
export class Content {}
