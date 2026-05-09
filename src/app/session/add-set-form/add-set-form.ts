import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output, signal,
} from '@angular/core';
import { ExerciseStore } from '../../store/exercises.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  BodyweightSet,
  ExerciseSet,
  ExerciseSetType,
  IsoSet,
  WeightedSet,
} from '../../domain/model/exercise-set.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-set-form',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatMiniFabButton,
    MatIcon,
  ],
  templateUrl: './add-set-form.html',
  styleUrl: './add-set-form.css',
})
export class AddSetForm {
  public exerciseId = input.required<string>();
  public newSet = output<ExerciseSet>();

  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly showForm = signal(false);
  protected readonly setTypeControl = new FormControl<ExerciseSetType>('bodyweight', {
    nonNullable: true,
    validators: [Validators.required],
  });
  protected readonly setTypeOptions: { label: string; value: ExerciseSetType }[] = [
    {
      label: 'Bodyweight',
      value: 'bodyweight',
    },
    {
      label: 'Weighted',
      value: 'weight',
    },
    {
      label: 'Isometric',
      value: 'iso',
    },
  ];
  protected readonly quantityControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(1)],
  });
  protected readonly weightControl = new FormControl<number>(0, { nonNullable: true });

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.setTypeControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {});
  }

  protected addSet(): void {
    const setType = this.setTypeControl.value;
    const quantity = this.quantityControl.value;
    const weight = this.weightControl.value;

    if (setType && quantity) {
      switch (setType) {
        case 'bodyweight':
          this.newSet.emit(new BodyweightSet(quantity));
          break;
        case 'weight':
          this.newSet.emit(new WeightedSet(quantity, weight));
          break;
        case 'iso':
          this.newSet.emit(new IsoSet(quantity, weight));
      }
    }
  }
}
