import { Component, computed, inject, output } from '@angular/core';
import { LibraryStore } from '@store/library.store';
import {
  MatActionList,
  MatDivider,
  MatListItem,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.html',
  styleUrl: './exercises-list.css',
  imports: [
    MatActionList,
    MatListItem,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
})
export class ExercisesList {
  public exerciseSelected = output<string>();
  private readonly store = inject(LibraryStore);

  protected readonly exercises = computed(() =>
    Object.groupBy(this.store.activeExercises(), (exercise) =>
      exercise.isFavourite ? 'favourite' : 'regular',
    ),
  );
  protected readonly favouriteExercises = computed(() => this.exercises().favourite ?? []);
  protected readonly regularExercises = computed(() => this.exercises().regular ?? []);
  protected readonly hasFavouriteExercises = computed(() => this.favouriteExercises().length > 0);
  protected readonly hasRegularExercises = computed(() => this.regularExercises().length > 0);
  protected readonly archivedExercises = this.store.archivedExercises;
  protected readonly hasArchivedExercises = computed(() => this.archivedExercises().length > 0);

  protected readonly entries = computed(() => [
    {
      isVisible: this.hasFavouriteExercises(),
      label: 'Favourite',
      icon: 'star',
      entries: this.favouriteExercises()
    },
    {
      isVisible: this.hasRegularExercises(),
      label: 'Regular',
      icon: 'apps',
      entries: this.regularExercises()
    },
    {
      isVisible: this.hasArchivedExercises(),
      label: 'Archived',
      icon: 'archive',
      entries: this.archivedExercises()
    }
  ])
}
