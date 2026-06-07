import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
} from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindMediaAndMeasurementsByExerciseLogIdQuery } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id.query';
import { Lozenge } from '@ui/lozenge/lozenge';
import { ImageRenderer } from '@session/components/image-renderer/image-renderer';
import { Line } from '@domain/model/line.model';

@Component({
  selector: 'app-progress-gallery',
  imports: [Lozenge, ImageRenderer],
  templateUrl: './progress-gallery.html',
  styleUrl: './progress-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressGallery {
  public exerciseLogId = input.required<string>();

  private readonly queryBus = inject(QueryBus);

  private readonly progressEntries = resource({
    params: () => ({ exerciseLogId: this.exerciseLogId() }),
    loader: ({ params }) =>
      this.queryBus.execute(new FindMediaAndMeasurementsByExerciseLogIdQuery(params.exerciseLogId)),
  });

  protected readonly mediaWithMeasurements = computed(() => {
    if (!this.progressEntries.isLoading() && this.progressEntries.hasValue()) {
      return this.progressEntries
        .value()
        .map(({ measurement: { landmarks, angle } = {}, media: { blob, size } }) => {
          const { width, height } = size;

          const points = Iterator.from(landmarks || [])
            .map(({ point }) => point.denormalized(width, height))
            .toArray();

          const lines = points?.reduce((lines, point, index, points) => {
            const nextPoint = points[index + 1];
            if (!nextPoint) return lines;
            lines.push(new Line(point, nextPoint));
            return lines;
          }, [] as Line[]);

          return {
            image: blob,
            width,
            height,
            points,
            lines,
            angle,
          };
        });
    }

    return [];
  });
}
