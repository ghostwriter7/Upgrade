import { inject, Injectable } from '@angular/core';
import { MediaCapturedEvent } from './media-captured.event';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { MediaRepository } from '@persistence/repository/media.repository';
import { Constructor } from '@common/types/constructor.type';
import { FileService } from '@common/service/file/file.service';

@Injectable()
export class MediaCapturedEventHandler implements EventHandler<MediaCapturedEvent> {
  private readonly mediaRepository = inject(MediaRepository);
  private readonly fileService = inject(FileService);

  public appliesTo(): Constructor<MediaCapturedEvent> {
    return MediaCapturedEvent;
  }

  public handle({ media }: MediaCapturedEvent): void {
    this.mediaRepository.save(media);
    const fileName = `${media.exerciseId}-${media.id}.jpeg`;
    this.fileService.persist(fileName, media.blob);
  }
}
