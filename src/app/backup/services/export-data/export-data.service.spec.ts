import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Mock } from 'vitest';
import { ExportDataService } from './export-data.service';
import { ExerciseLog, Session } from '../../../domain/model/session.model';
import { BodyweightSet } from '../../../domain/model/exercise-set.model';
import { ExerciseSetMapper } from '../../../persistence/mapper/exercise-set/exercise-set.mapper';
import { SessionMapper } from '../../../persistence/mapper/session/session.mapper';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';
import { ExerciseLogMapper } from '../../../persistence/mapper/exercise-entry/exercise-log.mapper';

describe('ExportDataService', () => {
  let sessionRepositoryMock: { getAllSessions: Mock };
  let setRepositoryMock: { getAllSets: Mock };
  let exerciseLogRepositoryMock: { getAllLogs: Mock };
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

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        { provide: ExerciseLogRepository, useValue: exerciseLogRepositoryMock },
        ExportDataService,
      ],
    });

    exportDataService = TestBed.inject(ExportDataService);
  });

  it('should export data to a file', async () => {
    const chinUpId = 'chin-ups';
    const pullUpId = 'pull-ups';
    const sessions = [Session.createEmpty(), Session.createEmpty()];
    sessionRepositoryMock.getAllSessions.mockResolvedValue(sessions);

    const exerciseLogs = [
      new ExerciseLog(sessions[0].uuid, chinUpId),
      new ExerciseLog(sessions[1].uuid, pullUpId),
    ];
    exerciseLogRepositoryMock.getAllLogs.mockResolvedValue(exerciseLogs);

    const sets = [
      new BodyweightSet(sessions[0].uuid, chinUpId, 0, 5),
      new BodyweightSet(sessions[0].uuid, chinUpId, 1, 5),
      new BodyweightSet(sessions[1].uuid, pullUpId, 0, 3),
      new BodyweightSet(sessions[1].uuid, pullUpId, 1, 3),
    ];
    setRepositoryMock.getAllSets.mockResolvedValue(sets);

    const writeMock = vi.fn();
    const closeMock = vi.fn();
    const handle = {
      createWritable: () =>
        Promise.resolve({
          write: writeMock,
          close: closeMock,
        }),
    };
    vi.spyOn(window, 'showSaveFilePicker').mockResolvedValueOnce(
      handle as unknown as FileSystemFileHandle,
    );

    await exportDataService.exportData();

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify(
        {
          sessions: sessions.map(SessionMapper.INSTANCE.toDto),
          sets: sets.map(ExerciseSetMapper.INSTANCE.toDto),
          exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
        },
        null,
        2,
      ),
    );
  });
});
