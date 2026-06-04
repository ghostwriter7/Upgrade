import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CaptureProgressCommandHandler } from './capture-progress-command.handler';
import { EventBus } from '@common/routers/event/event-bus';
import { CaptureProgressCommand } from './capture-progress.command';
import { Session } from '@domain/model/session/session.model';
import { MediaCapturedEvent } from '../../events/media-captured/media-captured.event';
import { Point } from '@domain/model/measurement.model';

describe('CaptureRecordingCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let handler: CaptureProgressCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        CaptureProgressCommandHandler,
      ],
    });

    handler = TestBed.inject(CaptureProgressCommandHandler);
  });

  test('should return a correct command type it can handle', () =>
    expect(handler.appliesTo()).toEqual(CaptureProgressCommand));

  test('should capture progress', () => {
    const command = new CaptureProgressCommand(
      new Blob(),
      100,
      100,
      120,
      [new Point(0, 0), new Point(10, 10), new Point(20, 20)],
      'exerciseId',
    );
    const { session } = Session.createEmpty()
      .addExerciseLog('exerciseId')
      .session.addExerciseLog('anotherExerciseId');
    sessionStateHolder.session.mockReturnValueOnce(session);
    const exerciseLogId = session.getExerciseById('exerciseId').id;

    handler.handle(command);

    expect(sessionStateHolder.set).toHaveBeenCalledWith(
      expect.objectContaining({
        exercises: expect.arrayContaining([
          expect.objectContaining({
            exerciseId: 'exerciseId',
            mediaIds: [expect.any(String)],
          }),
          expect.objectContaining({
            exerciseId: 'anotherExerciseId',
          }),
        ]),
      }),
    );
    expect(eventBus.publish).toHaveBeenCalledExactlyOnceWith(
      new MediaCapturedEvent(
        expect.objectContaining({
          exerciseId: 'exerciseId',
          exerciseLogId: exerciseLogId,
          blob: command.image,
          size: {
            width: command.width,
            height: command.height,
          },
        }),
      ),
    );
  });
});
