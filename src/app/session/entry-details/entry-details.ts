import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ExerciseLog } from '../../domain/model/session.model';
import { MediaRepository } from '../../persistence/repository/media.repository';

@Component({
  selector: 'app-entry-details',
  imports: [],
  templateUrl: './entry-details.html',
  styleUrl: './entry-details.css',
})
export class EntryDetails {
  private readonly data = inject(MAT_BOTTOM_SHEET_DATA) as { exerciseLog: ExerciseLog };

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly mediaRepository = inject(MediaRepository);

  public async ngOnInit(): Promise<void> {
    const video = this.video().nativeElement;
    const media = await this.mediaRepository.findMedia(this.data.exerciseLog.mediaIds[0]!);
    if (media) {
      const url = URL.createObjectURL(media.blob);
      video.src = url;
    }
  }
}
