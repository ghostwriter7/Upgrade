import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CaptureRecordingCommand } from './capture-recording.command';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { ExerciseMedia } from '../../../domain/model/exercise-media.model';
import { MediaCapturedEvent } from '../../events/media-captured/media-captured.event';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class CaptureRecordingCommandHandler implements CommandHandler<CaptureRecordingCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<CaptureRecordingCommand> {
    return CaptureRecordingCommand;
  }

  public handle({ image, width, height, exerciseId }: CaptureRecordingCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const sessionId = session.uuid;

    const media = ExerciseMedia.newImage(exerciseId, sessionId, image, width, height);

    const updatedSession = session.addMediaToExercise(exerciseId, media.uuid);
    this.sessionStateHolder.set(updatedSession);
    this.eventBus.publish(new MediaCapturedEvent(media));
  }
}
