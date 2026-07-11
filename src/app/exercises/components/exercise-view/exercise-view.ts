import { Component, computed, inject, input, resource } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindExerciseLogsByExerciseIdQuery } from '@session/queries/find-exercise-logs-by-exercise-id/find-exercise-logs-by-exercise-id.query';
import { Loader } from '@ui/loader/loader';
import { ExerciseCard } from '@session/components/exercise-card/exercise-card';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { ExerciseLogSummary } from '@session/components/exercise-log-summary/exercise-log-summary';
import { MatList, MatListItem } from '@angular/material/list';
import { ProgressGallery } from '@session/components/progress-gallery/progress-gallery';
import { SetView } from '@session/components/set-view/set-view';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exercise-view',
  imports: [
    Loader,
    ExerciseCard,
    MatCard,
    ExerciseLogSummary,
    MatList,
    MatListItem,
    ProgressGallery,
    SetView,
    MatCardContent,
    MatCardHeader,
    DatePipe,
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
