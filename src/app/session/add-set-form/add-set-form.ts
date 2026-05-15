import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ExerciseStore } from '../../store/exercises.store';
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
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { ExerciseLog } from '../../domain/model/session.model';

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
    ReactiveFormsModule,
    MatButton,
    MatMiniFabButton,
    MatIcon,
    FormField,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  templateUrl: './add-set-form.html',
  styleUrl: './add-set-form.css',
})
export class AddSetForm {
  public exerciseLog = input.required<ExerciseLog>()
  public newSet = output<ExerciseSet>();

  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly isCloneDisabled = computed(() => this.exerciseLog().isEmpty);
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
        return { kind: 'error', message: 'Weight must be positive' };
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
          break;
      }
    }
    this.showForm.set(false);
  }

  protected decrementReps(): void {
    this.setModel.update((model) => ({ ...model, reps: Math.max(model.reps - 1, 1) }));
  }

  protected incrementReps(): void {
    this.setModel.update((model) => ({ ...model, reps: model.reps + 1 }));
  }

  protected decrementWeight(): void {
    this.setModel.update((model) => ({ ...model, weight: Math.max(model.weight - 1, 0) }));
  }

  protected incrementWeight(): void {
    this.setModel.update((model) => ({ ...model, weight: model.weight + 1 }));
  }

  protected decrementDuration(): void  {
    this.setModel.update((model) => ({ ...model, duration: Math.max(model.duration - 1, 1) }));
  }

  protected incrementDuration(): void {
    this.setModel.update((model) => ({ ...model, duration: model.duration + 1 }));
  }

  protected setWeight(weight: number): void {
    this.setModel.update((model) => ({ ...model, weight }));
  }

  protected setReps(reps: number): void {
    this.setModel.update((model) => ({ ...model, reps }));
  }

  protected setDuration(duration: number): void {
    this.setModel.update((model) => ({ ...model, duration }));
  }

  protected copyLastSet(): void {
    const lastSet = this.exerciseLog().sets.at(-1);
    if (lastSet) {
      this.newSet.emit(lastSet);
    }
  }
}
