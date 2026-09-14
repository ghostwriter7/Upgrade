import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { ZipService } from '@common/service/zip/zip.service';
import { FileService } from '@common/service/file/file.service';
import { Database } from '@infrastructure/database';

@Injectable({ providedIn: 'root' })
export class ExportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly zipService = inject(ZipService);
  private readonly fileService = inject(FileService);
  private readonly databaseConnection = inject(Database);

  public async exportDatabase(): Promise<void> {
    const bytes = await this.databaseConnection.export();
    const handle = await window.showSaveFilePicker({
      suggestedName: `upgradedb.sqlite3`,
      types: [
        {
          description: 'Upgrade DB',
          accept: {
            'application/octet-stream': ['.sqlite3'],
          },
        },
      ],
    });
    const writableStream = await handle.createWritable();

    await writableStream.write(bytes);
    await writableStream.close();
  }

  public async exportData(): Promise<void> {
    return;
    // const [sessions, exerciseLogs, angleMeasurements, media] = await Promise.all([
    //   this.sessionRepository.getAllSessions(),
    //   this.exerciseLogRepository.getAllLogs(),
    //   this.angleMeasurementRepository.getAllMeasurements(),
    //   this.mediaRepository.getAllMedia(),
    // ]);
    //
    // const data: ExportData = {
    //   sessions: sessions.map(SessionMapper.INSTANCE.toDto),
    //   exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
    //   angleMeasurements: angleMeasurements.map(AngleMeasurementMapper.INSTANCE.toDto),
    //   media: media.map(ExerciseMediaMapper.INSTANCE.toDto),
    // };
    //
    // const json = JSON.stringify(data, null, 2);
    //
    // const files: File[] = await (media.length
    //   ? this.fileService.getMany(media.map((entry) => `${entry.exerciseId}-${entry.id}.jpeg`))
    //   : Promise.resolve([]));
    // const fileBytes = await Promise.all(files.map((file) => file.bytes()));
    //
    // const zipStructure: ZipStructure = {
    //   data: new TextEncoder().encode(json),
    //   images: fileBytes.reduce(
    //     (directory, fileByte, index) => {
    //       const mediaEntry = media[index];
    //       const fileName = `${mediaEntry.exerciseId}-${mediaEntry.id}.jpeg`;
    //       return {
    //         ...directory,
    //         [fileName]: [fileByte, { level: 0 }],
    //       };
    //     },
    //     {} as Record<string, [Uint8Array<ArrayBufferLike>, ZipOptions]>,
    //   ),
    // };
    //
    // const zipFile = this.zipService.zip(zipStructure);
    //
    // const handle = await window.showSaveFilePicker({
    //   suggestedName: `upgrade-backup-${Temporal.Now.plainDateISO().toString()}`,
    //   types: [
    //     {
    //       description: 'Upgrade Backup ZIP',
    //       accept: {
    //         'application/zip': ['.zip'],
    //       },
    //     },
    //   ],
    // });
    // const writableStream = await handle.createWritable();
    //
    // await writableStream.write(zipFile);
    // await writableStream.close();
    //
    // return {
    //   totalSessions: sessions.length,
    //   totalSets: sets.length,
    //   totalExerciseLogs: exerciseLogs.length,
    //   totalAngleMeasurements: angleMeasurements.length,
    //   totalMedia: media.length,
    // };
  }
}
