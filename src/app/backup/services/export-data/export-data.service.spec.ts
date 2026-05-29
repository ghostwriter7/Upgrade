import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Mock } from 'vitest';
import { ExportDataService } from './export-data.service';
import { Session } from '../../../domain/model/session.model';
import { BodyweightSet } from '../../../domain/model/exercise-set.model';
import { ExerciseSetMapper } from '../../../persistence/mapper/exercise-set/exercise-set.mapper';
import { SessionMapper } from '../../../persistence/mapper/session/session.mapper';

describe('ExportDataService', () => {
  let sessionRepositoryMock: { getAllSessions: Mock };
  let setRepositoryMock: { getAllSets: Mock };
  let exportDataService: ExportDataService;

  beforeEach(async () => {
    sessionRepositoryMock = {
      getAllSessions: vi.fn(),
    };

    setRepositoryMock = {
      getAllSets: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: SetRepository, useValue: setRepositoryMock },
        ExportDataService,
      ],
    });

    exportDataService = TestBed.inject(ExportDataService);
  });

  it('should export data to a file', async () => {
    const sessions = [
      Session.createEmpty().addExercise('chin-ups'),
      Session.createEmpty().addExercise('pull-ups'),
    ];
    sessionRepositoryMock.getAllSessions.mockResolvedValue(sessions);
    const sets = [
      new BodyweightSet(sessions[0].uuid, 'chin-ups', 0, 5),
      new BodyweightSet(sessions[0].uuid, 'chin-ups', 1, 5),
      new BodyweightSet(sessions[1].uuid, 'pull-ups', 0, 3),
      new BodyweightSet(sessions[1].uuid, 'pull-ups', 1, 3),
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
        },
        null,
        2,
      ),
    );
  });
});
