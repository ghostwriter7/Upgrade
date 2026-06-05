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

@Component({
  selector: 'app-progress-gallery',
  imports: [Lozenge],
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
            .map((point) => ({ x: point.x, y: point.y }))
            .toArray();

          const lines = points?.reduce(
            (lines, point, index, points) => {
              const nextPoint = points[index + 1];
              if (!nextPoint) return lines;
              lines.push({ x1: point.x, y1: point.y, x2: nextPoint.x, y2: nextPoint.y });
              return lines;
            },
            [] as { x1: number; y1: number; x2: number; y2: number }[],
          );

          return {
            srcUrl: URL.createObjectURL(blob),
            width,
            height,
            viewBox: `0 0 ${width} ${height}`,
            points,
            lines,
            angle
          };
        });
    }

    return [];
  });
}
