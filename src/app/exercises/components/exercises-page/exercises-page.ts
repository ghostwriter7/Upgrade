import { Component, inject } from '@angular/core';
import { ExercisesList } from '../exercises-list/exercises-list';
import { ExerciseDropdown } from '../exercise-dropdown/exercise-dropdown';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-exercises-page',
  imports: [ExercisesList, ExerciseDropdown, MatButton, RouterLink],
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
