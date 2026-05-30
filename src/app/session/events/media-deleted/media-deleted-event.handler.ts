import { inject, Injectable } from '@angular/core';
import { EventConstructor, EventHandler } from '../event-handler.interface';
import { MediaDeletedEvent } from './media-deleted.event';
import { MediaRepository } from '../../../persistence/repository/media.repository';

@Injectable()
export class MediaDeletedEventHandler implements EventHandler<MediaDeletedEvent> {
  private readonly mediaRepository = inject(MediaRepository);

  public appliesTo(): EventConstructor<MediaDeletedEvent> {
    return MediaDeletedEvent;
  }

  public handle(event: MediaDeletedEvent): void {
    this.mediaRepository.deleteMedia(event.mediaId);
  }

}
