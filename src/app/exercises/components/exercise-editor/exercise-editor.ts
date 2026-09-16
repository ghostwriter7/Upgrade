import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ExerciseStore } from '@store/exercises.store';
import { MatButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { NewExercise } from '@domain/model/exercise.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-editor',
  imports: [MatFormField, MatInput, MatLabel, FormField, MatButton, MatError],
  templateUrl: './exercise-editor.html',
  styleUrl: './exercise-editor.css',
  host: {
    class: 'page',
  },
})
export default class ExerciseEditor {
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly router = inject(Router);

  private readonly model = signal({
    name: '',
  });

  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);

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

    const { name } = this.model();
    const drill: NewExercise = { name, id: createNanoId() };

    this.exerciseStore.save(drill);

    this.router.navigate(['/exercises']);
  }
}
