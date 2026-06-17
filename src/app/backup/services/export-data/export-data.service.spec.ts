import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { Mock } from 'vitest';
import { ExportDataService } from './export-data.service';
import { Session } from '@domain/model/session/session.model';
import { SessionMapper } from '@persistence/mapper/session/session.mapper';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurement, Landmark, Point } from '@domain/model/measurement.model';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { BodyPart } from '@domain/enum/body-part.enum';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { ExerciseMediaMapper } from '@persistence/mapper/exercise-media.mapper';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('ExportDataService', async () => {
  let sessionRepositoryMock: { getAllSessions: Mock };
  let setRepositoryMock: { getAllSets: Mock };
  let exerciseLogRepositoryMock: { getAllLogs: Mock };
  let angleMeasurementRepositoryMock: { getAllMeasurements: Mock };
  let mediaRepository: { getAllMedia: Mock };
  let exportDataService: ExportDataService;

  beforeEach(async () => {
    sessionRepositoryMock = {
      getAllSessions: vi.fn(),
    };

    setRepositoryMock = {
      getAllSets: vi.fn(),
    };

    exerciseLogRepositoryMock = {
      getAllLogs: vi.fn(),
    };

    angleMeasurementRepositoryMock = {
      getAllMeasurements: vi.fn(),
    };

    mediaRepository = {
      getAllMedia: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepositoryMock },
        { provide: MediaRepository, useValue: mediaRepository },
        ExportDataService,
      ],
    });

    exportDataService = TestBed.inject(ExportDataService);
  });
  const chinUpId = 'chin-ups';
  const pullUpId = 'pull-ups';
  const sessions = [Session.createEmpty(), Session.createEmpty()];

  const exerciseLogs = [
    new ExerciseLog(sessions[0].uuid, chinUpId),
    new ExerciseLog(sessions[1].uuid, pullUpId),
  ];

  const sets = [
    bwSet(0, 5, { sessionId: sessions[0].uuid, exerciseId: chinUpId }),
    bwSet(1, 5, { sessionId: sessions[0].uuid, exerciseId: chinUpId }),
    bwSet(0, 3, { sessionId: sessions[1].uuid, exerciseId: pullUpId }),
    bwSet(1, 3, { sessionId: sessions[1].uuid, exerciseId: pullUpId }),
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

  const media = [ExerciseMedia.newImage(chinUpId, exerciseLogs[0].id, blackPixelBlob, 3, 3)];

  const measurements = [
    AngleMeasurement.new(media[0].id, chinUpId, exerciseLogs[0].id, 120, [
      new Landmark(new Point(0, 0), BodyPart.LeftAnkle),
      new Landmark(new Point(5, 5), BodyPart.PelvisCenter),
      new Landmark(new Point(10, 0), BodyPart.RightAnkle),
    ]),
  ];

  it('should export data to a file', async () => {
    sessionRepositoryMock.getAllSessions.mockResolvedValue(sessions);
    exerciseLogRepositoryMock.getAllLogs.mockResolvedValue(exerciseLogs);
    setRepositoryMock.getAllSets.mockResolvedValue(sets);
    mediaRepository.getAllMedia.mockResolvedValue(media);
    angleMeasurementRepositoryMock.getAllMeasurements.mockResolvedValue(measurements);

    const writeMock = vi.fn();
    const closeMock = vi.fn();
    const handle = {
      createWritable: () =>
        Promise.resolve({
          write: writeMock,
          close: closeMock,
        }),
    } as unknown as FileSystemFileHandle;
    vi.spyOn(window, 'showSaveFilePicker').mockResolvedValueOnce(handle);

    await exportDataService.exportData();

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          sessions: sessions.map(SessionMapper.INSTANCE.toDto),
          sets,
          exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
          angleMeasurements: measurements.map(AngleMeasurementMapper.INSTANCE.toDto),
          media: await Promise.all(media.map(ExerciseMediaMapper.INSTANCE.toJson)),
        },
        null,
        2,
      ),
    );
  });
});
