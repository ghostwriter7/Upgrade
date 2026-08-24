import { Component, input } from '@angular/core';
import { Target } from '@domain/model/target';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-target-view',
  templateUrl: './target-view.html',
  styleUrl: './target-view.css',
  imports: [JsonPipe],
})
export class TargetView {
  public readonly target = input.required<Target>();
}
