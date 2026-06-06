import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { SessionMapper } from '@persistence/mapper/session/session.mapper';
import { ExerciseSetMapper } from '@persistence/mapper/exercise-set/exercise-set.mapper';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { MediaRepository } from '@persistence/repository/media.repository';
import { ExerciseMediaMapper } from '@persistence/mapper/exercise-media.mapper';
import { SessionDto } from '@persistence/schema/session.schema';
import { ExerciseSetDto } from '@persistence/schema/set.schema';
import { ExerciseLogDto } from '@persistence/schema/exercise-log.schema';
import { AngleMeasurementDto } from '@persistence/schema/angle-measurement.schema';
import { JsonSerializedMediaDto } from '@persistence/schema/media.schema';

interface ExportData {
  sessions: SessionDto[];
  sets: ExerciseSetDto[];
  exerciseLogs: ExerciseLogDto[];
  angleMeasurements?: AngleMeasurementDto[];
  media?: JsonSerializedMediaDto[];
}

@Injectable({ providedIn: 'root' })
export class ExportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);
  private readonly mediaRepository = inject(MediaRepository);

  public async exportData(): Promise<void> {
    const [sessions, sets, exerciseLogs, angleMeasurements, media] = await Promise.all([
      this.sessionRepository.getAllSessions(),
      this.setRepository.getAllSets(),
      this.exerciseLogRepository.getAllLogs(),
      this.angleMeasurementRepository.getAllMeasurements(),
      this.mediaRepository.getAllMedia(),
    ]);

    const data: ExportData = {
      sessions: sessions.map(SessionMapper.INSTANCE.toDto),
      sets: sets.map(ExerciseSetMapper.INSTANCE.toDto),
      exerciseLogs: exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDto),
      angleMeasurements: angleMeasurements.map(AngleMeasurementMapper.INSTANCE.toDto),
    };

    if (media) {
      data.media = await Promise.all(media.map(ExerciseMediaMapper.INSTANCE.toJson));
    }

    const json = JSON.stringify(data, null, 2);

    const handle = await window.showSaveFilePicker({
      suggestedName: `upgrade-backup-${Temporal.Now.plainDateISO().toString()}`,
      types: [
        {
          description: 'Upgrade Backup',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
    const writableStream = await handle.createWritable();

    await writableStream.write(json);
    await writableStream.close();
  }
}
