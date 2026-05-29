import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Mock } from 'vitest';
import { ImportDataService } from './import-data.service';
import { Session } from '../../../domain/model/session.model';
import { BodyweightSet } from '../../../domain/model/exercise-set.model';
import { ExerciseSetMapper } from '../../../persistence/mapper/exercise-set/exercise-set.mapper';
import { SessionMapper } from '../../../persistence/mapper/session/session.mapper';
import { createUuid } from '../../../common/function/create-uuid.function';

describe('ImportDataService', () => {
  let sessionRepositoryMock: { save: Mock; deleteAllSessions: Mock };
  let setRepositoryMock: { upsertSet: Mock; deleteAllSets: Mock };
  let importDataService: ImportDataService;

  beforeEach(async () => {
    sessionRepositoryMock = {
      deleteAllSessions: vi.fn(),
      save: vi.fn(),
    };

    setRepositoryMock = {
      upsertSet: vi.fn(),
      deleteAllSets: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        ImportDataService,
      ],
    });

    importDataService = TestBed.inject(ImportDataService);
  });

  const createSetMatcher = (set: BodyweightSet) =>
    expect.objectContaining({
      id: set.id,
      exerciseId: set.exerciseId,
      sessionId: set.sessionId,
      index: set.index,
      reps: set.reps,
    });

  const createSessionMatcher = (session: Session) =>
    expect.objectContaining({
      uuid: session.uuid,
      exercises: expect.arrayContaining([
        expect.objectContaining({
          exerciseId: session.exercises[0].exerciseId,
        }),
      ]),
    });

  it('should import data from a file', async () => {
    const chinUpsId = createUuid();
    const pullUpsId = createUuid();
    const sessions = [
      Session.createEmpty().addExercise(chinUpsId),
      Session.createEmpty().addExercise(pullUpsId),
    ];
    const sets = [
      new BodyweightSet(sessions[0].uuid, chinUpsId, 0, 5),
      new BodyweightSet(sessions[0].uuid, chinUpsId, 1, 5),
      new BodyweightSet(sessions[1].uuid, pullUpsId, 0, 3),
      new BodyweightSet(sessions[1].uuid, pullUpsId, 1, 3),
    ];

    const json = JSON.stringify({
      sessions: sessions.map(SessionMapper.INSTANCE.toDto),
      sets: sets.map(ExerciseSetMapper.INSTANCE.toDto),
    });
    vi.spyOn(window, 'showOpenFilePicker').mockResolvedValueOnce([
      {
        getFile: () =>
          Promise.resolve(new File([json], 'imported-data.json', { type: 'application/json' })),
      } as unknown as FileSystemFileHandle,
    ]);

    await importDataService.importData();

    expect(setRepositoryMock.deleteAllSets).toHaveBeenCalledTimes(1);
    expect(sessionRepositoryMock.deleteAllSessions).toHaveBeenCalledTimes(1);
    expect(setRepositoryMock.upsertSet).toHaveBeenCalledTimes(4);
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(1, createSetMatcher(sets[0]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(2, createSetMatcher(sets[1]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(3, createSetMatcher(sets[2]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(4, createSetMatcher(sets[3]));
    expect(sessionRepositoryMock.save).toHaveBeenCalledTimes(2);
    expect(sessionRepositoryMock.save).toHaveBeenNthCalledWith(1, createSessionMatcher(sessions[0]));
    expect(sessionRepositoryMock.save).toHaveBeenNthCalledWith(2, createSessionMatcher(sessions[1]));
  });
});
