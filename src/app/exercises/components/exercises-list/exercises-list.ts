import { Component, computed, inject, output } from '@angular/core';
import { ExerciseStore } from '@store/exercises.store';
import {
  MatActionList,
  MatDivider,
  MatListItem,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.html',
  styleUrl: './exercises-list.css',
  imports: [MatActionList, MatListItem, MatListSubheaderCssMatStyler, MatIcon, MatDivider],
})
export class ExercisesList {
  public exerciseSelected = output<string>();
  private readonly store = inject(ExerciseStore);

  protected readonly exercises = computed(() =>
    Object.groupBy(this.store.exercises(), (exercise) =>
      exercise.isFavourite ? 'favourite' : 'remaining',
    ),
  );
  protected readonly favouriteExercises = computed(() => this.exercises().favourite ?? []);
  protected readonly remainingExercises = computed(() => this.exercises().remaining ?? []);
  protected readonly hasFavouriteExercises = computed(() => this.favouriteExercises().length > 0);
}
