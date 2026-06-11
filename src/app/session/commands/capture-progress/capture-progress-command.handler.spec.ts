import { describe, test, vi, Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { CaptureProgressCommandHandler } from './capture-progress-command.handler';
import { EventBus } from '@common/routers/event/event-bus';
import { CaptureProgressCommand } from './capture-progress.command';
import { Session } from '@domain/model/session/session.model';
import { MediaCapturedEvent } from '../../events/media-captured/media-captured.event';
import { Landmark, Point } from '@domain/model/measurement.model';
import { ExerciseStore } from '@store/exercises.store';
import { Exercise } from '@domain/model/exercise.model';
import { BodyPart } from '@domain/enum/body-part.enum';
import { AngleMeasurementCapturedEvent } from '@session/events/angle-measurement-captured/angle-measurement-captured.event';

describe('CaptureProgressCommandHandler', () => {
  let eventBus: { publish: Mock };
  let sessionStateHolder: { session: Mock; set: Mock };
  let exerciseStore: { getExerciseById: Mock };
  let handler: CaptureProgressCommandHandler;

  beforeEach(() => {
    eventBus = { publish: vi.fn() };
    sessionStateHolder = { session: vi.fn(), set: vi.fn() };
    exerciseStore = { getExerciseById: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: EventBus, useValue: eventBus },
        { provide: SessionStateHolder, useValue: sessionStateHolder },
        { provide: ExerciseStore, useValue: exerciseStore },
        CaptureProgressCommandHandler,
      ],
    });

    handler = TestBed.inject(CaptureProgressCommandHandler);
  });

  test('should return a correct command type it can handle', () =>
    expect(handler.appliesTo()).toEqual(CaptureProgressCommand));

  const exerciseId = 'chin-ups';

  test('should capture progress with measurements', () => {
    const points = [new Point(0, 0), new Point(10, 10), new Point(20, 20)];
    const command = new CaptureProgressCommand(exerciseId, new Blob(), 100, 100, 120, points);
    const { session } = Session.createEmpty()
      .addExerciseLog(exerciseId)
      .session.addExerciseLog('anotherExerciseId');
    sessionStateHolder.session.mockReturnValueOnce(session);
    const exerciseLogId = session.getExerciseById(exerciseId).id;

    const exercise = new Exercise(exerciseId, 'Any Exercise', 'Any Description');
    exercise.measurementDefinition = {
      landmarks: [BodyPart.RightAnkle, BodyPart.PelvisCenter, BodyPart.LeftAnkle],
    };
    exerciseStore.getExerciseById.mockReturnValueOnce(exercise);

    handler.handle(command);

    expect(eventBus.publish).toHaveBeenNthCalledWith(
      1,
      new MediaCapturedEvent(
        expect.objectContaining({
          exerciseId,
          exerciseLogId,
          blob: command.image,
          size: {
            width: command.width,
            height: command.height,
          },
        }),
      ),
    );
    expect(eventBus.publish).toHaveBeenNthCalledWith(
      2,
      new AngleMeasurementCapturedEvent(
        expect.objectContaining({
          exerciseId,
          exerciseLogId,
          angle: command.angle,
          landmarks: [
            new Landmark(points[0], BodyPart.RightAnkle),
            new Landmark(points[1], BodyPart.PelvisCenter),
            new Landmark(points[2], BodyPart.LeftAnkle),
          ],
        }),
      ),
    );
  });

  test('should capture progress without measurements', () => {
    const command = new CaptureProgressCommand(exerciseId, new Blob(), 100, 100);
    const { session } = Session.createEmpty()
      .addExerciseLog(exerciseId)
      .session.addExerciseLog('anotherExerciseId');
    sessionStateHolder.session.mockReturnValueOnce(session);
    const exerciseLogId = session.getExerciseById(exerciseId).id;

    handler.handle(command);

    expect(exerciseStore.getExerciseById).not.toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledExactlyOnceWith(
      new MediaCapturedEvent(
        expect.objectContaining({
          exerciseId,
          exerciseLogId,
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
