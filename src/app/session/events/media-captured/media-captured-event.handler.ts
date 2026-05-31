import { inject, Injectable } from '@angular/core';
import { MediaCapturedEvent } from './media-captured.event';
import { EventHandler } from '../event-handler.interface';
import { MediaRepository } from '../../../persistence/repository/media.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class MediaCapturedEventHandler implements EventHandler<MediaCapturedEvent> {
  private readonly mediaRepository = inject(MediaRepository);

  public appliesTo(): Constructor<MediaCapturedEvent> {
    return MediaCapturedEvent;
  }

  public handle(event: MediaCapturedEvent): void {
    this.mediaRepository.save(event.media);
  }

}
