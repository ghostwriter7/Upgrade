import { Component, inject, output } from '@angular/core';
import { ExerciseStore } from '@store/exercises.store';
import {
  MatActionList,
  MatListItem,
} from '@angular/material/list';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.html',
  styleUrl: './exercises-list.css',
  imports: [MatActionList, MatListItem],
})
export class ExercisesList {
  public exerciseSelected = output<string>();
  protected readonly exercises = inject(ExerciseStore).exercises;
}
