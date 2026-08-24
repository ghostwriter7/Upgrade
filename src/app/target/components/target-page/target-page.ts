import { Component } from '@angular/core';
import { TargetForm } from '../target-form/target-form';
import { TargetResult } from '../target-form/target-result';

@Component({
  selector: 'app-target-page',
  imports: [TargetForm],
  templateUrl: './target-page.html',
  styleUrl: './target-page.css',
  host: {
    class: 'page',
  },
})
export default class TargetPage {
  protected onSaveTarget(targetResult: TargetResult): void {}
}
