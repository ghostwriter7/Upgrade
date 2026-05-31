import { Provider } from '@angular/core';
import { EVENT_HANDLERS } from '@common/routers/event/event-handlers.token';
import { SetUpdatedEventHandler } from './set-updated/set-updated-event.handler';
import { SetDeletedEventHandler } from './set-deleted/set-deleted-event.handler';
import { SetCreatedEventHandler } from './set-created/set-created-event.handler';
import { SessionUpdatedEventHandler } from './session-updated/session-updated-event.handler';
import { MediaDeletedEventHandler } from './media-deleted/media-deleted-event.handler';
import { MediaCapturedEventHandler } from './media-captured/media-captured-event.handler';
import { ExerciseLogCreatedEventHandler } from './exercise-log-created/exercise-log-created-event.handler';
import { ExerciseLogDeletedEventHandler } from './exercise-log-deleted/exercise-log-deleted-event.handler';
import { ExerciseLogUpdatedEventHandler } from './exercise-log-updated/exercise-log-updated-event.handler';
import { SessionDeletedEventHandler } from './delete-session/session-deleted-event.handler';

export class EventHandlerProvider {
  public static forRoot(): Provider[] {
    return [
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: SetUpdatedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: SetDeletedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: SetCreatedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: SessionUpdatedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: SessionDeletedEventHandler,
      },
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
        useClass: ExerciseLogCreatedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: ExerciseLogDeletedEventHandler,
      },
      {
        provide: EVENT_HANDLERS,
        multi: true,
        useClass: ExerciseLogUpdatedEventHandler,
      },
    ];
  }
}
