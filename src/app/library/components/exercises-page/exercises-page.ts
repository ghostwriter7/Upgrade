import { Component, inject } from '@angular/core';
import { ExercisesList } from '../exercises-list/exercises-list';
import { ExerciseDropdown } from '../exercise-dropdown/exercise-dropdown';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';

@Component({
  selector: 'app-exercises-page',
  imports: [ExercisesList, ExerciseDropdown, RouterLink, MatFabButton, MatIcon, MatDivider],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.css',
  host: {
    class: 'page',
  },
})
export default class ExercisesPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected onExerciseSelected(exerciseId: string): void {
    this.router.navigate([exerciseId], { relativeTo: this.route });
  }
}
