import { Component, inject } from '@angular/core';
import { TargetForm } from '../target-form/target-form';
import { IconButton } from '@ui/icon-button/icon-button';
import { MatDivider } from '@angular/material/list';
import { TargetStore } from '@store/target.store';
import { TargetList } from '../target-list/target-list';

@Component({
  selector: 'app-target-page',
  imports: [TargetForm, IconButton, MatDivider, TargetList],
  templateUrl: './target-page.html',
  styleUrl: './target-page.css',
  host: {
    class: 'page',
  },
})
export default class TargetPage {
  protected readonly targetStore = inject(TargetStore);
  protected readonly showForm = this.targetStore.showForm;

  protected readonly targets = this.targetStore.targets;
}
