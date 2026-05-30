import { inject, Injectable } from '@angular/core';
import { CreateSetCommand } from './create-set.command';
import { CommandConstructor, CommandHandler } from '../command-handler.interface';
import { SetIdProvider } from '../../services/set-id-provider/set-id-provider.service';
import { SetDataMapper } from '../../components/set-form/mapper/set-data.mapper';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { EventBus } from '../../routers/event-bus';
import { SetCreatedEvent } from '../../events/set-created/set-created.event';
import { createUuid } from '../../../common/function/create-uuid.function';

@Injectable()
export class CreateSetCommandHandler implements CommandHandler<CreateSetCommand> {
  private readonly setIdProvider = inject(SetIdProvider);
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): CommandConstructor<CreateSetCommand> {
    return CreateSetCommand;
  }

  public handle({ setData, exerciseId }: CreateSetCommand): void {
    const session = this.sessionStateHolder.session();

    if (!session) throw new Error('Session not found');

    const exercise = session.getExerciseById(exerciseId);
    const set = SetDataMapper.toDomain(setData, exerciseId, session.uuid, exercise.sets.length);
    set.id = createUuid();

    this.sessionStateHolder.set(session.addSet(set));
    this.eventBus.dispatch(new SetCreatedEvent(set));
  }
}
