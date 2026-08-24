import { Component, inject, signal } from '@angular/core';
import { TargetForm } from '../target-form/target-form';
import { TargetResult } from '../target-form/target-result';
import { IconButton } from '@ui/icon-button/icon-button';
import { MatDivider } from '@angular/material/list';
import { TargetStore } from '@store/target.store';
import { Target } from '@domain/model/target';
import { createNanoId } from '@common/function/create-uuid.function';
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
  protected readonly showForm = signal(false);
  private readonly targetStore = inject(TargetStore);

  protected readonly targets = this.targetStore.targets;

  protected onSaveTarget(targetResult: TargetResult): void {
    const target: Target = {
      ...targetResult,
      id: createNanoId(),
      createdAt: Temporal.Now.instant(),
    };

    this.targetStore.save(target);
    this.showForm.set(false);
  }

  protected onCancel(): void {
    this.showForm.set(false);
  }
}
