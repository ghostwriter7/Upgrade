import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CaptureRecordingCommandHandler } from './capture-recording-command.handler';
import { EventBus } from '@common/routers/event/event-bus';
import { CaptureRecordingCommand } from './capture-recording.command';
import { Session } from '../../../domain/model/session/session.model';
import { MediaCapturedEvent } from '../../events/media-captured/media-captured.event';

describe('CaptureRecordingCommandHandler', () => {
  let eventBus: { dispatch: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: CaptureRecordingCommandHandler;

  beforeEach(() => {
    eventBus = { dispatch: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        CaptureRecordingCommandHandler,
      ],
    });

    handler = TestBed.inject(CaptureRecordingCommandHandler);
  });

  test('should return a correct command type it can handle', () =>
    expect(handler.appliesTo()).toEqual(CaptureRecordingCommand));

  test('should add a media to an exercise', () => {
    const command = new CaptureRecordingCommand(new Blob(), 100, 100, 'exerciseId');
    const { session } = Session.createEmpty()
      .addExerciseLog('exerciseId')
      .session
      .addExerciseLog('anotherExerciseId');
    sessionStateHolder.session.mockReturnValueOnce(session);

    handler.handle(command);

    expect(sessionStateHolder.set).toHaveBeenCalledWith(expect.objectContaining({
      exercises: expect.arrayContaining([
        expect.objectContaining({
          exerciseId: 'exerciseId',
          mediaIds: [expect.any(String)],
        }),
        expect.objectContaining({
          exerciseId: 'anotherExerciseId',
        }),
      ]),
    }));
    expect(eventBus.dispatch).toHaveBeenCalledExactlyOnceWith(
      new MediaCapturedEvent(
        expect.objectContaining({
          exerciseId: 'exerciseId',
          sessionId: session.uuid,
          blob: command.image,
          width: command.width,
          height: command.height,
        }),
      ),
    );
  });
});
