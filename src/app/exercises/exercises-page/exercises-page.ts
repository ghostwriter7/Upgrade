import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatActionList, MatDivider, MatListItem } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ExerciseStore } from '../../store/exercises.store';
import { Exercise } from '../../domain/model/exercise.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercises-page',
  imports: [MatActionList, MatButton, MatDivider, MatListItem, RouterLink],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.css',
})
export default class ExercisesPage {
  private readonly store = inject(ExerciseStore);

  protected readonly exercises: Signal<Exercise[]> = this.store.exercises;
}
