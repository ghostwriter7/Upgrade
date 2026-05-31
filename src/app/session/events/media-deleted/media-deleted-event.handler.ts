import { inject, Injectable } from '@angular/core';
import { EventHandler } from '@common/routers/event/event-handler.interface';
import { MediaDeletedEvent } from './media-deleted.event';
import { MediaRepository } from '@persistence/repository/media.repository';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class MediaDeletedEventHandler implements EventHandler<MediaDeletedEvent> {
  private readonly mediaRepository = inject(MediaRepository);

  public appliesTo(): Constructor<MediaDeletedEvent> {
    return MediaDeletedEvent;
  }

  public handle(event: MediaDeletedEvent): void {
    this.mediaRepository.deleteMedia(event.mediaId);
  }

}
