import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource, signal,
} from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindMediaAndMeasurementsByExerciseLogIdQuery } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id.query';
import { Lozenge } from '@ui/lozenge/lozenge';
import { ImageRenderer } from '@session/components/image-renderer/image-renderer';
import { Line } from '@domain/model/line.model';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { CommandBus } from '@common/routers/command/command-bus';
import { DownloadImageCommand } from '@session/commands/download-image/download-image.command';

@Component({
  selector: 'app-progress-gallery',
  imports: [Lozenge, ImageRenderer, MatIcon, MatMiniFabButton],
  templateUrl: './progress-gallery.html',
  styleUrl: './progress-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressGallery {
  public exerciseLogId = input.required<string>();

  private readonly queryBus = inject(QueryBus);
  private readonly commandBus = inject(CommandBus);

  private readonly progressEntries = resource({
    params: () => ({ exerciseLogId: this.exerciseLogId() }),
    loader: ({ params }) =>
      this.queryBus.execute(new FindMediaAndMeasurementsByExerciseLogIdQuery(params.exerciseLogId)),
  });

  protected readonly showActions = signal(false);
  protected readonly current = signal(1);
  protected readonly total = computed(() => this.mediaWithMeasurements().length);
  protected readonly showCounter = computed(() => this.total() > 1);
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

  protected onScroll(event: Event): void {
    const carousel = event.target as HTMLDivElement;
    const { scrollWidth, scrollLeft } = carousel;

    const scrolledPercentage = scrollLeft / scrollWidth;
    const current = Math.floor(this.total() * scrolledPercentage) + 1;

    this.current.set(current);
  }

  protected onDownload(): void {
    const media = this.mediaWithMeasurements().at(this.current() - 1);
    if (media) {
      const { image } = media;
      this.commandBus.dispatch(new DownloadImageCommand(image, this.exerciseLogId()));
    }
  }

  protected toggleActions(): void {
    this.showActions.update((show) => !show);
  }
}
