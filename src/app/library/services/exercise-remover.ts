import { inject, Service } from '@angular/core';
import { LibraryStore } from '@store/library.store';

@Service()
export class ExerciseRemover {
  private readonly libraryStore = inject(LibraryStore);

  public removeById(id: string): void {
    const exercise = this.libraryStore.exerciseById()[id];
    if (exercise.stats.lastPerformedAt) {
      this.libraryStore.updateExercise({ ...exercise, status: 'archived' });
    } else {
      this.libraryStore.deleteExercise(exercise);
    }
  }
}
