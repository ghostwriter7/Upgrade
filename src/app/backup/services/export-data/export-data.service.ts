import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { SessionMapper } from '@persistence/mapper/session/session.mapper';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { MediaRepository } from '@persistence/repository/media.repository';
import { SessionDto } from '@persistence/schema/session.schema';
import { ExerciseSetDto } from '@persistence/schema/set.schema';
import { ExerciseLogDto } from '@persistence/schema/exercise-log.schema';
import { AngleMeasurementDto } from '@persistence/schema/angle-measurement.schema';
import { BackupSummary } from '@backup/interfaces/summary.interface';
import { ExerciseMediaDto } from '@persistence/schema/media.schema';
import { ExerciseMediaMapper } from '@persistence/mapper/exercise-media.mapper';
import { ZipService } from '@common/service/zip/zip.service';
import { FileService } from '@common/service/file/file.service';
import { ZipOptions } from 'fflate';

interface ExportData {
  sessions: SessionDto[];
  sets: ExerciseSetDto[];
  exerciseLogs: ExerciseLogDto[];
  angleMeasurements?: AngleMeasurementDto[];
  media?: ExerciseMediaDto[];
}

@Injectable({ providedIn: 'root' })
export class ExportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly zipService = inject(ZipService);
  private readonly fileService = inject(FileService);

  public async exportData(): Promise<BackupSummary> {
    const [sessions, sets, exerciseLogs, angleMeasurements, media] = await Promise.all([
      this.sessionRepository.getAllSessions(),
      this.setRepository.getAllSets(),
      this.exerciseLogRepository.getAllLogs(),
      this.angleMeasurementRepository.getAllMeasurements(),
      this.mediaRepository.getAllMedia(),
    ]);

    const data: ExportData = {
      sessions: sessions.map(SessionMapper.INSTANCE.toDto),
      sets,
      exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
      angleMeasurements: angleMeasurements.map(AngleMeasurementMapper.INSTANCE.toDto),
      media: media.map(ExerciseMediaMapper.INSTANCE.toDto),
    };

    const json = JSON.stringify(data, null, 2);

    const files: File[] = await (media.length
      ? this.fileService.getMany(media.map((entry) => `${entry.exerciseId}-${entry.id}.jpeg`))
      : Promise.resolve([]));
    const fileBytes = await Promise.all(files.map((file) => file.bytes()));

    const zipStructure = {
      'data.json': new TextEncoder().encode(json),
      images: fileBytes.reduce(
        (directory, fileByte, index) => {
          const mediaEntry = media[index];
          const fileName = `${mediaEntry.exerciseId}-${mediaEntry.id}.jpeg`;
          return {
            ...directory,
            [fileName]: [fileByte, { level: 0 }] as [Uint8Array<ArrayBufferLike>, ZipOptions],
          };
        },
        {} as Record<string, [Uint8Array<ArrayBufferLike>, ZipOptions]>,
      ),
    };

    const zipFile = this.zipService.zip(zipStructure);

    const handle = await window.showSaveFilePicker({
      suggestedName: `upgrade-backup-${Temporal.Now.plainDateISO().toString()}`,
      types: [
        {
          description: 'Upgrade Backup ZIP',
          accept: {
            'application/zip': ['.zip'],
          },
        },
      ],
    });
    const writableStream = await handle.createWritable();

    await writableStream.write(zipFile);
    await writableStream.close();

    return {
      totalSessions: sessions.length,
      totalSets: sets.length,
      totalExerciseLogs: exerciseLogs.length,
      totalAngleMeasurements: angleMeasurements.length,
      totalMedia: media.length,
    };
  }
}
