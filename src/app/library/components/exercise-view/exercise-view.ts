import { Component, computed, inject, input, resource } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindExerciseLogsByExerciseIdQuery } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id.query';
import { Loader } from '@ui/loader/loader';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ExerciseLogSummary } from '@session/components/exercise-log-summary/exercise-log-summary';
import { ProgressGallery } from '@session/components/progress-gallery/progress-gallery';
import { MatDivider } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LibraryStore } from '@store/library.store';
import { SetType } from '@domain/enum/set-type.enum';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { Confirm } from '@ui/confirm/confirm';
import { ExerciseRemover } from '@library/services/exercise-remover';
import { Status } from '@domain/enum/status.enum';
import { EXERCISE_TYPE_LABELS } from '@domain/enum/exercise-types.enum';

@Component({
  selector: 'app-exercise-view',
  imports: [
    Loader,
    MatCard,
    ExerciseLogSummary,
    ProgressGallery,
    MatCardContent,
    MatCardHeader,
    MatDivider,
    MatIcon,
    RouterLink,
    MatCardTitle,
    MatChipSet,
    MatChip,
    Confirm,
    MatMiniFabButton,
  ],
  templateUrl: './exercise-view.html',
  styleUrl: './exercise-view.css',
  host: {
    class: 'page',
  },
})
export default class ExerciseView {
  public id = input.required<string>();

  private readonly libraryStore = inject(LibraryStore);
  protected readonly isActive = computed(() => this.exercise()?.status === Status.active);
  protected readonly confirmDeleteMessage = computed(() =>
    this.hasNoLogs()
      ? `Are you sure you want to permanently delete "${this.exercise()?.name}"?`
      : `Do you want to archive "${this.exercise()?.name}"?`,
  );
  private readonly exerciseRemover = inject(ExerciseRemover);
  protected readonly deleteIcon = computed(() => (this.hasNoLogs() ? 'delete' : 'archive'));
  protected readonly exercise = computed(() => {
    const exercise = this.libraryStore.exerciseById()[this.id()];

    if (!exercise) return null;

    return {
      ...exercise,
      unitsOfMeasurement: (exercise.unitsOfMeasurement ?? []).map((unit) => SetType[unit]),
      status: Status[exercise.status],
      type: EXERCISE_TYPE_LABELS[exercise.type],
    };
  });
  private readonly queryBus = inject(QueryBus);

  protected readonly logs = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => this.queryBus.execute(new FindExerciseLogsByExerciseIdQuery(params.id)),
  });

  protected readonly loading = computed(() => this.logs.isLoading() || !this.exercise());
  protected readonly hasNoLogs = computed(() => !this.loading() && this.logs.value()?.length === 0);
  private readonly router = inject(Router);

  protected deleteExercise(): void {
    this.exerciseRemover.removeById(this.id()!);
    this.router.navigate(['/exercises']);
  }
}
