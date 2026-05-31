import { inject, Injectable } from '@angular/core';
import { CreateSetCommand } from './create-set.command';
import { CommandHandler } from '../command-handler.interface';
import { SetDataMapper } from '../../components/set-form/mapper/set-data.mapper';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '@common/routers/event/event-bus';
import { SetCreatedEvent } from '../../events/set-created/set-created.event';
import { createUuid } from '../../../common/function/create-uuid.function';
import { Constructor } from '@common/types/constructor.type';

@Injectable()
export class CreateSetCommandHandler implements CommandHandler<CreateSetCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<CreateSetCommand> {
    return CreateSetCommand;
  }

  public handle({ setData, exerciseId }: CreateSetCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const exercise = session.getExerciseById(exerciseId);
    const set = SetDataMapper.toDomain(setData, exerciseId, session.uuid, exercise.sets.length);
    set.id = createUuid();

    this.sessionStateHolder.set(session.addSet(set));
    this.eventBus.publish(new SetCreatedEvent(set));
  }
}
