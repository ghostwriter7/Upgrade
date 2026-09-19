import { Component, computed, inject, output, signal } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { LibraryStore } from '@store/library.store';
import { Exercise } from '@domain/model/exercise.model';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-exercise-dropdown',
  imports: [
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    FormField,
  ],
  templateUrl: './exercise-dropdown.html',
  styleUrl: './exercise-dropdown.css',
})
export class ExerciseDropdown {
  public exerciseSelected = output<string>();

  private readonly libraryStore = inject(LibraryStore);
  private readonly model = signal<{ exercise: Exercise | string | null }>({ exercise: null });

  protected readonly exerciseForm = form(this.model);

  protected readonly options = computed(() => {
    const { exercise } = this.model();
    const filter = exercise ? this.displayExercise(exercise)?.toLowerCase() : null;

    if (!filter) return this.libraryStore.activeExercises();

    return this.libraryStore
      .activeExercises()
      .filter((exercise) => exercise.name.toLowerCase().includes(filter));
  });

  protected displayExercise(exercise?: Exercise | string | null): string {
    if (!exercise) return '';
    return typeof exercise === 'string' ? exercise : exercise.name;
  }
}
