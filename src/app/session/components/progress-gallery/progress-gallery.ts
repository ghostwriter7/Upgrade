import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindMediaAndMeasurementsByExerciseLogIdQuery } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id.query';
import { Lozenge } from '@ui/lozenge/lozenge';
import { ImageRenderer } from '@session/components/image-renderer/image-renderer';
import { Line } from '@domain/model/line.model';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { CommandBus } from '@common/routers/command/command-bus';
import { DownloadImageCommand } from '@session/commands/download-image/download-image.command';
import { FileService } from '@common/service/file/file.service';
import { Point } from '@domain/model/measurement.model';

interface UiMedia {
  image: Blob;
  width: number;
  height: number;
  points: Point[];
  lines: Line[];
  angle?: number;
}

@Component({
  selector: 'app-progress-gallery',
  imports: [Lozenge, ImageRenderer, MatIcon, MatMiniFabButton],
  templateUrl: './progress-gallery.html',
  styleUrl: './progress-gallery.css',
})
export class ProgressGallery {
  public exerciseLogId = input.required<string>();

  private readonly queryBus = inject(QueryBus);
  private readonly commandBus = inject(CommandBus);

  protected readonly showActions = signal(false);
  protected readonly current = signal(1);
  protected readonly total = computed(() => this.mediaWithMeasurements().length);
  protected readonly showCounter = computed(() => this.total() > 1);

  protected readonly mediaWithMeasurements = signal<UiMedia[]>([]);

  private readonly fileService = inject(FileService);

  constructor() {
    effect(async () => {
      const exerciseLogId = this.exerciseLogId();

      const results = await this.queryBus.execute(
        new FindMediaAndMeasurementsByExerciseLogIdQuery(exerciseLogId),
      );

      if (!results.length) return;

      const fileNames = results.map(({ media }) => `${media.exerciseId}-${media.id}.jpeg`);
      const files = await this.fileService.getMany(fileNames);
      const arrayBuffers = await Promise.all(files.map((file) => file.arrayBuffer()));

      const finalResults = results.map(
        ({ media: { size }, measurement: { landmarks, angle } = {} }, i) => {
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

          const arrayBuffer = arrayBuffers[i];
          const blob = new Blob([arrayBuffer]);

          return {
            image: blob,
            width,
            height,
            points,
            lines,
            angle,
          };
        },
      );

      this.mediaWithMeasurements.set(finalResults);
    });
  }

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
