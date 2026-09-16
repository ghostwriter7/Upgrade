import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ExerciseStore } from '@store/exercises.store';
import { MatFabButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { NewExercise } from '@domain/model/exercise.model';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SetType } from '@domain/enum/set-type.enum';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';

interface DrillModel {
  name: string;
  unitsOfMeasurement: ExerciseSetType[];
}

@Component({
  selector: 'app-exercise-editor',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    FormField,
    MatError,
    MatFabButton,
    MatIcon,
    MatOption,
    MatSelect,
  ],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.css',
  host: {
    class: 'page',
  },
})
export default class ExerciseEditor {
  public readonly id = input<string>();

  protected readonly isEdit = computed(() => !!this.id());
  protected readonly originalDrill = computed(() =>
    this.exerciseStore.allExercises().find((exercise) => exercise.id === this.id()),
  );
  protected readonly originalName = computed(() => this.originalDrill()?.name);

  private readonly exerciseStore = inject(ExerciseStore);
  private readonly router = inject(Router);

  protected readonly unitsOfMeasurements = Object.entries(SetType)
    .map(([key, value]) => ({ value: key, label: value }))
    .sort((a, b) => a.label.localeCompare(b.label));

  private readonly model = signal<DrillModel>({
    name: '',
    unitsOfMeasurement: [],
  });

  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.unitsOfMeasurement, 1);

    validate(schemaPath.name, ({ value }) => {
      const name = value().toLowerCase();
      const originalName = this.originalName()?.toLowerCase();

      if (name === originalName) return null;

      if (this.exerciseStore.existsByName(name)) {
        return {
          kind: 'duplicate',
          message: 'Drill already exists',
        };
      }
      return null;
    });
  });

  constructor() {
    const ref = effect(() => {
      if (this.isEdit()) {
        const drill = this.originalDrill();

        if (drill) {
          this.model.set({
            name: drill.name,
            unitsOfMeasurement: drill.unitsOfMeasurement ?? [],
          });
          ref.destroy();
        }
      }
    });
  }

  protected save(): void {
    if (this.form().invalid()) return;

    const isEdit = !!this.id();

    const id = this.id() ?? createNanoId();

    const { name, unitsOfMeasurement } = this.model();
    const drill: NewExercise = { name, id, unitsOfMeasurement };

    if (isEdit) {
      this.exerciseStore.update(drill);
    } else {
      this.exerciseStore.save(drill);
    }

    this.router.navigate(['/exercises']);
  }

  protected cancel(): void {
    this.router.navigate(['/exercises']);
  }
}
