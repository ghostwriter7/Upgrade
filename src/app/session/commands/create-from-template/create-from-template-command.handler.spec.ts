import { Mock, test, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '@session/store/session-state-holder.store';
import { Session } from '@domain/model/session/session.model';
import { CreateFromTemplateCommandHandler } from '@session/commands/create-from-template/create-from-template-command.handler';
import { CreateFromTemplateCommand } from '@session/commands/create-from-template/create-from-template.command';
import { createNanoId } from '@common/function/create-uuid.function';
import { EventBus } from '@common/routers/event/event-bus';
import { SessionUpdatedEvent } from '@session/events/session-updated/session-updated.event';
import { ExerciseLogCreatedEvent } from '@session/events/exercise-log-created/exercise-log-created.event';

describe('CreateFromTemplateCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStateHolder: { set: Mock };
  let handler: CreateFromTemplateCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
    sessionStateHolder = { set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        CreateFromTemplateCommandHandler,
      ],
    });

    handler = TestBed.inject(CreateFromTemplateCommandHandler);
  });

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(CreateFromTemplateCommand));

  test('should initialize a new session from template', () => {
    const exerciseIds = ['side-split', 'front-split'];
    const command = new CreateFromTemplateCommand({
      id: createNanoId(),
      name: 'Template 1',
      description: '',
      exerciseIds,
      isFavourite: false,
    });

    handler.handle(command);

    const session: Session = sessionStateHolder.set.mock.calls[0][0];
    expect(sessionStateHolder.set).toHaveBeenCalledExactlyOnceWith(
      expect.toSatisfy(
        (value) => value instanceof Session && value.exercises.length === exerciseIds.length,
      ),
    );
    expect(eventBus.publish).toHaveBeenNthCalledWith(1, new SessionUpdatedEvent(session));
    expect(eventBus.publish).toHaveBeenNthCalledWith(
      2,
      new ExerciseLogCreatedEvent(session.exercises[0]),
    );
    expect(eventBus.publish).toHaveBeenNthCalledWith(
      3,
      new ExerciseLogCreatedEvent(session.exercises[1]),
    );
  });
});
