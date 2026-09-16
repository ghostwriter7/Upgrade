import { Component, inject, signal } from '@angular/core';
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
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly router = inject(Router);

  protected readonly unitsOfMeasurements = Object.entries(SetType)
    .map(([key, value]) => ({ value: key, label: value }))
    .sort((a, b) => a.label.localeCompare(b.label));

  private readonly model = signal({
    name: '',
    unitsOfMeasurement: [] as ExerciseSetType[],
  });

  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.unitsOfMeasurement, 1);

    validate(schemaPath.name, ({ value }) => {
      const name = value().toLowerCase();

      if (this.exerciseStore.existsByName(name)) {
        return {
          kind: 'duplicate',
          message: 'Drill already exists',
        };
      }
      return null;
    });
  });

  protected save(): void {
    if (this.form().invalid()) return;

    const { name, unitsOfMeasurement } = this.model();
    const drill: NewExercise = { name, id: createNanoId(), unitsOfMeasurement };

    this.exerciseStore.save(drill);

    this.router.navigate(['/exercises']);
  }

  protected cancel(): void {
    this.router.navigate(['/exercises']);
  }
}
