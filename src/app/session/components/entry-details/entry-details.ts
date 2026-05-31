import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MediaRepository } from '@persistence/repository/media.repository';
import { ExerciseLog } from '@domain/model/exercise-log.model';

@Component({
  selector: 'app-entry-details',
  imports: [],
  templateUrl: './entry-details.html',
  styleUrl: './entry-details.css',
})
export class EntryDetails implements OnInit {
  private readonly data = inject(MAT_BOTTOM_SHEET_DATA) as { exerciseLog: ExerciseLog };

  private readonly mediaRepository = inject(MediaRepository);
  protected readonly media = signal<{ src: string; width: number; height: number }[]>([]);

  public ngOnInit(): void {
    this.initializeMedia();
  }

  private async initializeMedia(): Promise<void> {
    const mediaEntries = await Promise.all(
      this.data.exerciseLog.mediaIds.map((mediaId) => this.mediaRepository.findMedia(mediaId)),
    );

    this.media.set(
      mediaEntries
        .filter((media) => !!media)
        .map(({ blob, width, height }) => ({ src: URL.createObjectURL(blob), width, height })),
    );
  }
}
