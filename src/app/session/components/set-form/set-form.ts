import { Component, computed, model } from '@angular/core';
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
import {
  durationOptions,
  repOptions,
  setTypeOptions,
  weightOptions,
} from './set-form-options.const';
import { SetData } from './set-data.interface';

@Component({
  selector: 'app-set-form',
  imports: [MatButton, MatButtonToggle, MatButtonToggleGroup, MatIcon, MatMiniFabButton, FormField],
  templateUrl: './set-form.html',
  styleUrl: './set-form.css',
})
export class SetForm implements FormValueControl<SetData> {
  public value = model.required<SetData>();

  public readonly isInvalid = computed(() => this.setForm().invalid());

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
    hidden(schemaPath.weight, ({ valueOf }) => valueOf(schemaPath.type) === 'bodyweight');
    hidden(schemaPath.reps, ({ valueOf }) => valueOf(schemaPath.type) === 'iso');
    hidden(schemaPath.duration, ({ valueOf }) => valueOf(schemaPath.type) !== 'iso');
  });
  protected readonly setTypeOptions = setTypeOptions;
  protected readonly durations = durationOptions;
  protected readonly reps = repOptions;
  protected readonly weights = weightOptions;

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

  protected setWeight(weight: number): void {
    this.update(({ weight }));
  }

  protected setReps(reps: number): void {
    this.update({ reps });
  }

  protected setDuration(duration: number): void {
    this.update({ duration });
  }

  private update(value: Partial<SetData>) {
    this.value.update((model) => ({ ...model, ...value }));
  }
}
