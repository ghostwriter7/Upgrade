import { Component, input } from '@angular/core';
import { Target } from '@domain/model/target';
import { TargetView } from '../target-view/target-view';

@Component({
  selector: 'app-target-list',
  templateUrl: './target-list.html',
  styleUrl: './target-list.css',
  imports: [TargetView],
})
export class TargetList {
  public targets = input.required<Target[]>();
}
