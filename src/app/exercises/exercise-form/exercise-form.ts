import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExerciseStore } from '../../store/exercises.store';
import { Exercise } from '../../domain/model/exercise.model';
import { ExerciseFactory } from '../../domain/factory/exercise.factory';


type ExerciseFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string | null>;
}>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-form',
  imports: [MatButton, MatFormField, MatInput, MatLabel, ReactiveFormsModule, RouterLink],
  templateUrl: './exercise-form.html',
  styleUrl: './exercise-form.css',
})
export default class ExerciseForm {
  public uuid = input<string | null>(null);
  private readonly store = inject(ExerciseStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly form: ExerciseFormGroup = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string | null>(null),
  });

  private readonly existingExercise = computed(() => {
    const uuid = this.uuid();
    return uuid ? this.store.getExerciseById(uuid) : null;
  });

  constructor() {
    effect(() => {
      const existingExercise = this.existingExercise();

      if (existingExercise) {
        this.form.setValue({
          name: existingExercise.name,
          description: existingExercise.description ?? null,
        });
      }
    });
  }

  protected save(): void {
    const value = this.form.value as Required<ExerciseFormGroup['value']>;
    const existingExercise = this.existingExercise();
    const uuid = this.uuid();

    if (existingExercise && uuid) {
      const exercise = new Exercise(
        uuid,
        value.name,
        value.description ?? null,
        existingExercise.createdAt,
        new Date().toISOString(),
      );
      this.store.update(exercise);
    } else {
      const exercise = ExerciseFactory.createNew(value.name, value.description);
      this.store.create(exercise);
    }

    this.router.navigate(['/exercises']);
  }
}
