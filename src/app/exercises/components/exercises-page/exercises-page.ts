import { Component } from '@angular/core';
import { ExercisesList } from '../exercises-list/exercises-list';

@Component({
  selector: 'app-exercises-page',
  imports: [ExercisesList],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.css',
})
export default class ExercisesPage {}
