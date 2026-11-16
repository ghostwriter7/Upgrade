import { Component, computed, inject, input } from '@angular/core';
import { Target } from '@domain/model/target';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { SkillNamePipe } from '@ui/pipes/skill-name.pipe';
import { MatMiniFabButton } from '@angular/material/button';
import { TargetStore } from '@store/target.store';

@Component({
  selector: 'app-target-view',
  templateUrl: './target-view.html',
  styleUrl: './target-view.css',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatIcon,
    MatListItem,
    MatList,
    MatDivider,
    MatChip,
    MatChipSet,
    SkillNamePipe,
    MatCardActions,
    MatMiniFabButton,
  ],
})
export class TargetView {
  public readonly target = input.required<Target>();

  protected readonly targetStore = inject(TargetStore);

  protected readonly commitmentHours = computed(() => {
    const minutes = this.target().weeklyCommitmentInMinutes;
    const hours = minutes / 60;

    return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  });
}
