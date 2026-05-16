import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '../../domain/model/exercise-set.model';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-set-view',
  imports: [MatIcon, MatMiniFabButton, MatMenuTrigger, MatMenu, MatMenuItem],
  templateUrl: './set-view.html',
  styleUrl: './set-view.css',
})
export class SetView {
  public isEditable = input.required<boolean>();
  public set = input.required<ExerciseSet>();
  public editSet = output<void>();
  public deleteSet = output<void>();

  public displayValue = computed(() => {
    const set = this.set();
    switch (set.type) {
      case 'bodyweight':
        return `${set.quantity} reps`;
      case 'weight': {
        const weightSet = set as WeightedSet;
        return `${weightSet.quantity} reps + ${weightSet.weight} kg`;
      }
      case 'iso': {
        const isoSet = set as IsoSet;
        if (isoSet.weight) {
          return `${isoSet.quantity} seconds + ${isoSet.weight} kg`;
        }
        return `${isoSet.quantity} seconds`;
      }
    }
  });
}
