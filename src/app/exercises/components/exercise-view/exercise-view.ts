import { Component, inject, input, resource } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindExerciseLogsByExerciseIdQuery } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id.query';
import { Loader } from '@ui/loader/loader';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { ExerciseLogSummary } from '@session/components/exercise-log-summary/exercise-log-summary';
import { ProgressGallery } from '@session/components/progress-gallery/progress-gallery';
import { MatDivider } from '@angular/material/list';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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
    MatFabButton,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './exercise-view.html',
  styleUrl: './exercise-view.css',
})
export default class ExerciseView {
  public id = input.required<string>();

  private readonly queryBus = inject(QueryBus);

  protected readonly logs = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => this.queryBus.execute(new FindExerciseLogsByExerciseIdQuery(params.id)),
  });

  protected readonly loading = this.logs.isLoading;
}
