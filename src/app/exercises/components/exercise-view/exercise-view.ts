import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exercise-view',
  imports: [],
  templateUrl: './exercise-view.html',
  styleUrl: './exercise-view.css',
})
export default class ExerciseView {
  public id = input.required<string>();
}
