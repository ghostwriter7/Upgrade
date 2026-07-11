import { Component, computed, inject, signal } from '@angular/core';
import { ExerciseStore } from '@store/exercises.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { form, FormField } from '@angular/forms/signals';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { Exercise } from '@domain/model/exercise.model';
import {
  MatActionList,
  MatListItem,
} from '@angular/material/list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.html',
  styleUrl: './exercises-list.css',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormField,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatActionList,
    MatListItem,
    RouterLink,
  ],
})
export class ExercisesList {
  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly exercises = this.exerciseStore.exercises;

  private readonly model = signal<{ exercise: Exercise | string | null }>({ exercise: null });
  protected readonly exerciseForm = form(this.model);

  protected readonly options = computed(() => {
    const { exercise } = this.model();
    const filter = (exercise instanceof Exercise ? exercise.name : exercise)?.toLowerCase();

    if (!filter) return this.exercises();

    return this.exercises().filter((exercise) => exercise.name.toLowerCase().includes(filter));
  });
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected select(exercise: Exercise): void {
    this.router.navigate([exercise.id], { relativeTo: this.route });
  }
}
