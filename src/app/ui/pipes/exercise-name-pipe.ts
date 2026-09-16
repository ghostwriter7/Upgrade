import { inject, Pipe, PipeTransform } from '@angular/core';
import { ExerciseStore } from '@store/exercises.store';

@Pipe({
  name: 'exerciseName',
})
export class ExerciseNamePipe implements PipeTransform {
  private readonly exerciseStore = inject(ExerciseStore);

  public transform(exerciseId: string): string {
    return this.exerciseStore.exerciseById()[exerciseId]?.name ?? 'Unknown Exercise';
  }
}
