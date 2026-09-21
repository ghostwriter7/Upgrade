import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { LibraryStore } from '@store/library.store';
import { MatFabButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { UpsertExercisePayload } from '@domain/model/exercise.model';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SetType } from '@domain/enum/set-type.enum';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ExerciseSetType } from '@domain/model/exercise-set/exercise-set.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

interface ExerciseModel {
  name: string;
  unitsOfMeasurement: ExerciseSetType[];
  isFavourite: boolean;
  skillIds: string[];
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
    MatCheckbox,
    FormsModule,
    RouterLink,
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
  protected readonly originalExercise = computed(() =>
    this.libraryStore.exercises().find((exercise) => exercise.id === this.id()),
  );
  protected readonly originalName = computed(() => this.originalExercise()?.name);

  private readonly libraryStore = inject(LibraryStore);
  protected readonly skills = this.libraryStore.skills;

  private readonly router = inject(Router);

  protected readonly unitsOfMeasurements = Object.entries(SetType)
    .map(([key, value]) => ({ value: key, label: value }))
    .sort((a, b) => a.label.localeCompare(b.label));

  private readonly model = signal<ExerciseModel>({
    name: '',
    unitsOfMeasurement: [],
    isFavourite: false,
    skillIds: [],
  });

  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
    minLength(schemaPath.unitsOfMeasurement, 1);

    validate(schemaPath.name, ({ value }) => {
      const name = value().toLowerCase();
      const originalName = this.originalName()?.toLowerCase();

      if (name === originalName) return null;

      if (this.libraryStore.existsByName(name)) {
        return {
          kind: 'duplicate',
          message: 'Exercise already exists',
        };
      }
      return null;
    });
  });

  constructor() {
    const ref = effect(() => {
      if (this.isEdit()) {
        const exercise = this.originalExercise();

        if (exercise) {
          this.model.set({
            name: exercise.name,
            unitsOfMeasurement: exercise.unitsOfMeasurement ?? [],
            isFavourite: exercise.isFavourite,
            skillIds: exercise.skillIds ?? [],
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

    const { name, unitsOfMeasurement, isFavourite, skillIds } = this.model();
    const exercise: UpsertExercisePayload = { name, id, unitsOfMeasurement, isFavourite, skillIds };

    if (isEdit) {
      this.libraryStore.updateExercise(exercise);
    } else {
      this.libraryStore.saveExercise(exercise);
    }

    this.router.navigate(['/exercises']);
  }
}
