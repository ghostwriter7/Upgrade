import { Component, computed, inject, input, model } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import {
  form,
  FormField,
  FormValueControl,
  hidden,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import { durationOptions, repOptions, weightOptions } from './set-form-options.const';
import { SetData } from './set-data.interface';
import { ExerciseStore } from '@store/exercises.store';
import { ExerciseSetType, ExerciseSetTypes } from '@domain/model/exercise-set/exercise-set.model';
import { SetType } from '@domain/enum/set-type.enum';

@Component({
  selector: 'app-set-form',
  imports: [MatButton, MatButtonToggle, MatButtonToggleGroup, MatIcon, MatMiniFabButton, FormField],
  templateUrl: './set-form.html',
  styleUrl: './set-form.css',
})
export class SetForm implements FormValueControl<SetData> {
  public value = model.required<SetData>();
  public exerciseId = input.required<string>();

  public readonly isInvalid = computed(() => this.setForm().invalid());

  private readonly exerciseStore = inject(ExerciseStore);
  private static readonly TIME_SET_TYPES = ['iso', 'duration'] as ExerciseSetType[];
  private static readonly NO_WEIGHT_SET_TYPES = ['bodyweight', 'duration'] as ExerciseSetType[];

  protected readonly setForm = form<SetData>(this.value, (schemaPath) => {
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
    hidden(schemaPath.weight, {
      when: ({ valueOf }) => SetForm.NO_WEIGHT_SET_TYPES.includes(valueOf(schemaPath.type)),
    });
    hidden(schemaPath.reps, {
      when: ({ valueOf }) => SetForm.TIME_SET_TYPES.includes(valueOf(schemaPath.type)),
    });
    hidden(schemaPath.duration, {
      when: ({ valueOf }) => !SetForm.TIME_SET_TYPES.includes(valueOf(schemaPath.type)),
    });
  });
  protected readonly setTypeOptions = computed(() => {
    const drill = this.exerciseStore.getExerciseById(this.exerciseId())!;
    const unitsOfMeasurement = drill.unitsOfMeasurement ?? ExerciseSetTypes;

    return Iterator.from(Object.entries(SetType))
      .filter(([key]) => unitsOfMeasurement.includes(key as ExerciseSetType))
      .map(([key, label]) => ({
        value: key,
        label,
        testId: `set-form-type-${key}`,
      }))
      .toArray();
  });
  protected readonly durations = computed(() => {
    const { duration } = this.value();
    return durationOptions.map((option) => ({
      ...option,
      disabled: duration + option.value <= 0,
    }));
  });
  protected readonly reps = repOptions;
  protected readonly weights = computed(() => {
    const { weight } = this.value();
    return weightOptions.map((option) => ({
      ...option,
      disabled: weight + option.value < 0,
    }));
  });

  protected decrementReps(): void {
    this.value.update((model) => ({ ...model, reps: Math.max(model.reps - 1, 1) }));
  }

  protected incrementReps(): void {
    this.value.update((model) => ({ ...model, reps: model.reps + 1 }));
  }

  protected decrementWeight(): void {
    this.value.update((model) => ({ ...model, weight: Math.max(model.weight - 1, 0) }));
  }

  protected incrementWeight(): void {
    this.value.update((model) => ({ ...model, weight: model.weight + 1 }));
  }

  protected decrementDuration(): void {
    this.value.update((model) => ({ ...model, duration: Math.max(model.duration - 1, 1) }));
  }

  protected incrementDuration(): void {
    this.value.update((model) => ({ ...model, duration: model.duration + 1 }));
  }

  protected updateWeight(weight: number): void {
    this.value.update((model) => ({ ...model, weight: model.weight + weight }));
  }

  protected setReps(reps: number): void {
    this.value.update((model) => ({ ...model, reps }));
  }

  protected updateDuration(duration: number): void {
    this.value.update((model) => ({ ...model, duration: model.duration + duration }));
  }
}
