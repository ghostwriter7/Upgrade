import { Component, inject } from '@angular/core';
import { ExercisesList } from '../exercises-list/exercises-list';
import { ExerciseDropdown } from '../exercise-dropdown/exercise-dropdown';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exercises-page',
  imports: [ExercisesList, ExerciseDropdown],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.css',
})
export default class ExercisesPage {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected onExerciseSelected(exerciseId: string): void {
    this.router.navigate([exerciseId], { relativeTo: this.route });
  }
}
