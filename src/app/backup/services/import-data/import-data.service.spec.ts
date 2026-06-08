import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { Mock } from 'vitest';
import { ImportDataService } from './import-data.service';
import { Session } from '@domain/model/session/session.model';
import { BodyweightSet } from '@domain/model/exercise-set.model';
import { ExerciseSetMapper } from '@persistence/mapper/exercise-set/exercise-set.mapper';
import { SessionMapper } from '@persistence/mapper/session/session.mapper';
import { createNanoId } from '@common/function/create-uuid.function';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurement, Landmark, Point } from '@domain/model/measurement.model';
import { BodyPart } from '@domain/enum/body-part.enum';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { ExerciseMediaMapper } from '@persistence/mapper/exercise-media.mapper';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';

describe('ImportDataService', () => {
  let sessionRepositoryMock: { save: Mock; deleteAllSessions: Mock };
  let setRepositoryMock: { upsertSet: Mock; deleteAllSets: Mock };
  let exerciseLogRepositoryMock: { saveLog: Mock; deleteAllLogs: Mock };
  let mediaRepository: { save: Mock; deleteAllMedia: Mock };
  let angleMeasurementRepository: { deleteAllMeasurements: Mock; saveMeasurement: Mock };
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

    exerciseLogRepositoryMock = {
      saveLog: vi.fn(),
      deleteAllLogs: vi.fn(),
    };

    mediaRepository = {
      save: vi.fn(),
      deleteAllMedia: vi.fn(),
    };

    angleMeasurementRepository = {
      deleteAllMeasurements: vi.fn(),
      saveMeasurement: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: MediaRepository, useValue: mediaRepository },
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepository },
        ImportDataService,
      ],
    });

    importDataService = TestBed.inject(ImportDataService);
  });

  const setMatcher = (set: BodyweightSet) =>
    expect.objectContaining({
      id: set.id,
      exerciseId: set.exerciseId,
      sessionId: set.sessionId,
      index: set.index,
      reps: set.reps,
    });

  const sessionMatcher = (session: Session) =>
    expect.objectContaining({
      uuid: session.uuid,
    });

  const exerciseLogMatcher = (exerciseLog: ExerciseLog) =>
    expect.objectContaining({
      sessionId: exerciseLog.sessionId,
      exerciseId: exerciseLog.exerciseId,
      id: exerciseLog.id,
    });

  const chinUpsId = createNanoId();
  const pullUpsId = createNanoId();
  const sessions = [Session.createEmpty(), Session.createEmpty()];
  const exerciseLogs = [
    new ExerciseLog(sessions[0].uuid, chinUpsId),
    new ExerciseLog(sessions[0].uuid, pullUpsId),
  ];
  const sets = [
    new BodyweightSet(sessions[0].uuid, chinUpsId, 0, 5),
    new BodyweightSet(sessions[0].uuid, chinUpsId, 1, 5),
    new BodyweightSet(sessions[1].uuid, pullUpsId, 0, 3),
    new BodyweightSet(sessions[1].uuid, pullUpsId, 1, 3),
  ];
  const blackPixelBlob = new Blob(
    [
      Uint8Array.from(
        atob(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+XqW8AAAAASUVORK5CYII=',
        ),
        (c) => c.charCodeAt(0),
      ),
    ],
    { type: 'image/png' },
  );

  const media = [ExerciseMedia.newImage(chinUpsId, exerciseLogs[0].id, blackPixelBlob, 3, 3)];

  const measurements = [
    AngleMeasurement.new(media[0].id, chinUpsId, exerciseLogs[0].id, 120, [
      new Landmark(new Point(0, 0), BodyPart.LeftAnkle),
      new Landmark(new Point(5, 5), BodyPart.PelvisCenter),
      new Landmark(new Point(10, 0), BodyPart.RightAnkle),
    ]),
  ];

  it('should import data from a file', async () => {
    const json = JSON.stringify({
      sessions: sessions.map(SessionMapper.INSTANCE.toDto),
      sets: sets.map(ExerciseSetMapper.INSTANCE.toDto),
      exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
      media: await Promise.all(media.map(ExerciseMediaMapper.INSTANCE.toJson)),
      angleMeasurements: measurements.map(AngleMeasurementMapper.INSTANCE.toDto),
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
    expect(exerciseLogRepositoryMock.deleteAllLogs).toHaveBeenCalledTimes(1);
    expect(mediaRepository.deleteAllMedia).toHaveBeenCalledTimes(1);
    expect(setRepositoryMock.deleteAllSets).toHaveBeenCalledTimes(1);

    expect(setRepositoryMock.upsertSet).toHaveBeenCalledTimes(4);
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(1, setMatcher(sets[0]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(2, setMatcher(sets[1]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(3, setMatcher(sets[2]));
    expect(setRepositoryMock.upsertSet).toHaveBeenNthCalledWith(4, setMatcher(sets[3]));

    expect(sessionRepositoryMock.save).toHaveBeenCalledTimes(2);
    expect(sessionRepositoryMock.save).toHaveBeenNthCalledWith(1, sessionMatcher(sessions[0]));
    expect(sessionRepositoryMock.save).toHaveBeenNthCalledWith(2, sessionMatcher(sessions[1]));

    expect(exerciseLogRepositoryMock.saveLog).toHaveBeenCalledTimes(2);
    expect(exerciseLogRepositoryMock.saveLog).toHaveBeenNthCalledWith(
      1,
      exerciseLogMatcher(exerciseLogs[0]),
    );
    expect(exerciseLogRepositoryMock.saveLog).toHaveBeenNthCalledWith(
      2,
      exerciseLogMatcher(exerciseLogs[1]),
    );

    expect(mediaRepository.save).toHaveBeenCalledExactlyOnceWith(media[0]);
    expect(angleMeasurementRepository.saveMeasurement).toHaveBeenCalledExactlyOnceWith(measurements[0]);
  });
});
