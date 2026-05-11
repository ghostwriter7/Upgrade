import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { min, form, FormField, hidden, required, validate } from '@angular/forms/signals';

type SetData = {
  type: ExerciseSetType;
  reps: number;
  weight: number;
  duration: number;
};

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
    FormField,
  ],
  templateUrl: './add-set-form.html',
  styleUrl: './add-set-form.css',
})
export class AddSetForm {
  public exerciseId = input.required<string>();
  public newSet = output<ExerciseSet>();

  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly showForm = signal(false);

  protected readonly setModel = signal<SetData>({
    type: 'bodyweight',
    reps: 1,
    weight: 0,
    duration: 0,
  });
  protected readonly setForm = form<SetData>(this.setModel, (schemaPath) => {
    required(schemaPath.reps);
    required(schemaPath.duration);
    required(schemaPath.weight, { when: ({ valueOf }) => valueOf(schemaPath.type) === 'weight' });
    min(schemaPath.reps, 1);
    min(schemaPath.duration, 1);
    validate(schemaPath.weight, ({ valueOf, value }) => {
      if (valueOf(schemaPath.type) === 'weight' && value() <= 0) {
        return { kind: 'error', message: 'Weight must be positive' }
      }
      return null;
    });
    hidden(schemaPath.weight, ({ valueOf }) => valueOf(schemaPath.type) === 'bodyweight');
    hidden(schemaPath.reps, ({ valueOf }) => valueOf(schemaPath.type) === 'iso');
    hidden(schemaPath.duration, ({ valueOf }) => valueOf(schemaPath.type) !== 'iso');
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

  protected addSet(): void {
    const { type, reps, weight, duration } = this.setModel();

    if (type) {
      switch (type) {
        case 'bodyweight':
          this.newSet.emit(new BodyweightSet(reps));
          break;
        case 'weight':
          this.newSet.emit(new WeightedSet(reps, weight));
          break;
        case 'iso':
          this.newSet.emit(new IsoSet(duration, weight));
      }
    }
  }
}
