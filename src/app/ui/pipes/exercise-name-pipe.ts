import { inject, Pipe, PipeTransform } from '@angular/core';
import { LibraryStore } from '@store/library.store';

@Pipe({
  name: 'exerciseName',
})
export class ExerciseNamePipe implements PipeTransform {
  private readonly libraryStore = inject(LibraryStore);

  public transform(exerciseId: string): string {
    return this.libraryStore.exerciseById()[exerciseId]?.name ?? 'Unknown Exercise';
  }
}
