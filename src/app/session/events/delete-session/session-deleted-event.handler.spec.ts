import { TestBed } from '@angular/core/testing';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SessionDeletedEvent } from './session-deleted.event';
import { Mock } from 'vitest';
import { SessionDeletedEventHandler } from './session-deleted-event.handler';
import { SetRepository } from '@persistence/repository/set.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { SessionRepository } from '@persistence/repository/session.repository';
import { Router } from '@angular/router';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';

describe('SessionDeletedEventHandler', () => {
  let exerciseLogRepositoryMock: { deleteAllBySessionId: Mock };
  let setRepositoryMock: { deleteAllBySessionId: Mock };
  let mediaRepositoryMock: { deleteAllByExerciseLogId: Mock };
  let angleMeasurementRepositoryMock: { deleteAllByExerciseLogId: Mock };
  let sessionRepositoryMock: { deleteById: Mock };
  let routerMock: { navigateByUrl: Mock; routerState: { snapshot: { url: string } } };
  let handler: SessionDeletedEventHandler;

  beforeEach(() => {
    exerciseLogRepositoryMock = { deleteAllBySessionId: vi.fn() };
    setRepositoryMock = { deleteAllBySessionId: vi.fn() };
    mediaRepositoryMock = { deleteAllByExerciseLogId: vi.fn() };
    angleMeasurementRepositoryMock = { deleteAllByExerciseLogId: vi.fn() };
    sessionRepositoryMock = { deleteById: vi.fn() };
    routerMock = { navigateByUrl: vi.fn(), routerState: { snapshot: { url: '' } } };

    TestBed.configureTestingModule({
      providers: [
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: MediaRepository, useValue: mediaRepositoryMock },
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepositoryMock },
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: Router, useValue: routerMock },
        SessionDeletedEventHandler,
      ],
    });

    handler = TestBed.inject(SessionDeletedEventHandler);
  });

  it('should create', () => expect(handler).toBeTruthy());

  it('should return a correct type it can handle', () =>
    expect(handler.appliesTo()).toEqual(SessionDeletedEvent));

  const assertRepositoryCalls = (sessionId: string, exerciseLogIds: string[]) => {
    expect(sessionRepositoryMock.deleteById).toHaveBeenCalledExactlyOnceWith(sessionId);
    expect(setRepositoryMock.deleteAllBySessionId).toHaveBeenCalledExactlyOnceWith(sessionId);
    exerciseLogIds.forEach((logId) => {
      expect(mediaRepositoryMock.deleteAllByExerciseLogId).toHaveBeenCalledWith(logId);
      expect(angleMeasurementRepositoryMock.deleteAllByExerciseLogId).toHaveBeenCalledWith(logId);
    });
    expect(exerciseLogRepositoryMock.deleteAllBySessionId).toHaveBeenCalledExactlyOnceWith(
      sessionId,
    );
  };

  it('should delete all session-related data and not redirect anywhere', () => {
    const event = new SessionDeletedEvent('sessionId', ['chin-ups', 'pull-ups']);
    routerMock.routerState.snapshot.url = '/session/2026-05-05';

    handler.handle(event);

    assertRepositoryCalls(event.sessionId, event.exerciseLogIds);
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  test.each([['session/edit'], ['session/new']])(
    'should delete all session-related data and redirect to home page',
    (url) => {
      const event = new SessionDeletedEvent('sessionId', ['chin-ups', 'pull-ups']);
      routerMock.routerState.snapshot.url = url;

      handler.handle(event);

      assertRepositoryCalls(event.sessionId, event.exerciseLogIds);
      expect(routerMock.navigateByUrl).toHaveBeenCalledExactlyOnceWith('/');
    },
  );
});
