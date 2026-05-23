import { Component, computed, model } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ExerciseSetType } from '../../domain/model/exercise-set.model';
import {
  form,
  FormField,
  FormValueControl,
  hidden,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { ExposureZoneOptions } from '../../domain/consts/exposure-zone-options.const';
import { DepthOptions } from '../../domain/consts/depth-options.const';
import { BreathQualityOptions } from '../../domain/consts/breath-quality-options.const';
import { Depth } from '../../domain/enum/depth.enum';
import { BreathQuality } from '../../domain/enum/breath-quality.enum';
import { ExposureZone } from '../../domain/enum/exposure-zone.enum';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgClass } from '@angular/common';

export interface SetData {
  type: ExerciseSetType;
  reps: number;
  weight: number;
  duration: number;
  depth: Depth | null;
  breathQuality: BreathQuality | null;
  exposureZone: ExposureZone | null;
}

@Component({
  selector: 'app-set-form',
  imports: [
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatMiniFabButton,
    FormField,
    MatChipListbox,
    MatChipOption,
    MatCard,
    MatCardContent,
    NgClass,
  ],
  templateUrl: './set-form.html',
  styleUrl: './set-form.css',
})
export class SetForm implements FormValueControl<SetData> {
  public value = model.required<SetData>();

  public readonly isInvalid = computed(() => this.setForm().invalid());

  protected readonly exposureZoneOptions = ExposureZoneOptions;
  protected readonly depthOptions = DepthOptions;
  protected readonly breathQualityOptions = BreathQualityOptions;
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
  protected readonly setTypeOptions: { label: string; value: ExerciseSetType; testId: `set-form-type-${string}` }[] = ([
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
  ] as const).map((option) => ({ ...option, testId: `set-form-type-${option.value}` }));
  protected readonly durations = [5, 10, 15, 20, 25, 30].map((value) => ({ value, testId: `set-form-duration-${value}` }));
  protected readonly reps = [1, 2, 3, 5, 8, 10].map((value) => ({ value, testId: `set-form-reps-${value}` }));
  protected readonly weights = [1, 2, 3, 5, 8, 10].map((value) => ({ value, testId: `set-form-weight-${value}` }));

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
    this.value.update((model) => ({ ...model, weight }));
  }

  protected setReps(reps: number): void {
    this.value.update((model) => ({ ...model, reps }));
  }

  protected setDuration(duration: number): void {
    this.value.update((model) => ({ ...model, duration }));
  }

  protected update(value: Partial<SetData>) {
    this.value.update((model) => ({ ...model, ...value }));
  }
}
