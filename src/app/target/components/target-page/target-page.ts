import { Component, signal } from '@angular/core';
import { TargetForm } from '../target-form/target-form';
import { TargetResult } from '../target-form/target-result';
import { IconButton } from '@ui/icon-button/icon-button';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-target-page',
  imports: [TargetForm, IconButton, MatDivider],
  templateUrl: './target-page.html',
  styleUrl: './target-page.css',
  host: {
    class: 'page',
  },
})
export default class TargetPage {
  protected readonly showForm = signal(false);

  protected onSaveTarget(targetResult: TargetResult): void {}
}
