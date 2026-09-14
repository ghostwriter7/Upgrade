import { Provider } from '@angular/core';
import { EVENT_HANDLERS } from '@common/routers/event/event-handlers.token';
import { MediaDeletedEventHandler } from './media-deleted/media-deleted-event.handler';
import { MediaCapturedEventHandler } from './media-captured/media-captured-event.handler';
import { AngleMeasurementCapturedEventHandler } from '@session/events/angle-measurement-captured/angle-measurement-captured-event.handler';

export class EventHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: MediaDeletedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: MediaCapturedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: AngleMeasurementCapturedEventHandler,
      },
    ];
  }
}
