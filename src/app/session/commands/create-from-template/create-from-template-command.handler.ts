import { inject, Injectable } from '@angular/core';
import { CommandHandler } from '@common/routers/command/command-handler.interface';
import { CreateFromTemplateCommand } from '@session/commands/create-from-template/create-from-template.command';
import { Constructor } from '@common/types/constructor.type';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { Session } from '@domain/model/session/session.model';
import { SessionUpdatedEvent } from '@session/events/session-updated/session-updated.event';
import { ExerciseLogCreatedEvent } from '@session/events/exercise-log-created/exercise-log-created.event';
import { EventBus } from '@common/routers/event/event-bus';

@Injectable()
export class CreateFromTemplateCommandHandler implements CommandHandler<CreateFromTemplateCommand> {
  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly eventBus = inject(EventBus);

  public appliesTo(): Constructor<CreateFromTemplateCommand> {
    return CreateFromTemplateCommand;
  }

  public handle({ template }: CreateFromTemplateCommand) {
    const { session, addedLogs } = Session.createEmpty().addExerciseLogs(template.exerciseIds);
    this.sessionStateHolder.set(session);

    this.eventBus.publish(new SessionUpdatedEvent(session));
    addedLogs.forEach((exerciseLog) =>
      this.eventBus.publish(new ExerciseLogCreatedEvent(exerciseLog)),
    );
  }
}
