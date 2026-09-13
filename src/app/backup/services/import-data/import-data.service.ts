import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '@persistence/repository/session.repository';
import { SetRepository } from '@persistence/repository/set.repository';
import { Session } from '@domain/model/session/session.model';
import { SessionSchema } from '@persistence/schema/session.schema';
import { SessionMapper } from '@persistence/mapper/session/session.mapper';
import { ExerciseSet } from '@domain/model/exercise-set/exercise-set.model';
import { ExerciseSetSchema } from '@persistence/schema/set.schema';
import { ExerciseLogSchema } from '@persistence/schema/exercise-log.schema';
import { ExerciseLogMapper } from '@persistence/mapper/exercise-log/exercise-log.mapper';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement/angle-measurement.repository';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurement } from '@domain/model/measurement.model';
import { AngleMeasurementSchema } from '@persistence/schema/angle-measurement.schema';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { ExerciseMedia } from '@domain/model/exercise-media.model';
import { ExerciseMediaSchema } from '@persistence/schema/media.schema';
import { ExerciseMediaMapper } from '@persistence/mapper/exercise-media.mapper';
import { BackupSummary } from '@backup/interfaces/summary.interface';
import { ZipService } from '@common/service/zip/zip.service';
import { FileService } from '@common/service/file/file.service';

@Injectable({ providedIn: 'root' })
export class ImportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly angleMeasurementRepository = inject(AngleMeasurementRepository);
  private readonly mediaRepository = inject(MediaRepository);
  private readonly zipService = inject(ZipService);
  private readonly fileService = inject(FileService);

  public async importData(): Promise<BackupSummary> {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'ZIP Files',
          accept: {
            'application/zip': ['.zip'],
          },
        },
      ],
    });
    const zipContent = await this.zipService.unzip(await handle.getFile());

    await this.handleImages(zipContent);

    return this.handleData(zipContent['data']);
  }

  private async handleData(input: Uint8Array<ArrayBuffer>): Promise<BackupSummary> {
    const json = new TextDecoder().decode(input);
    const data = JSON.parse(json);

    const sessions = this.getSessions(data);
    const sets = this.getSets(data);
    const exerciseLogs = this.getExerciseLogs(data);
    const angleMeasurements = this.getAngleMeasurements(data);
    const media = this.getMedia(data);

    await this.clearResources();

    await Promise.all([
      ...sessions.map((session) => this.sessionRepository.save(session)),
      ...sets.map((set) => this.setRepository.updateSet(set)),
      ...exerciseLogs.map((exerciseLog) => this.exerciseLogRepository.saveLog(exerciseLog)),
      ...angleMeasurements.map((angleMeasurement) =>
        this.angleMeasurementRepository.saveMeasurement(angleMeasurement),
      ),
      ...media.map((media) => this.mediaRepository.save(media)),
    ]);

    return {
      totalSessions: sessions.length,
      totalSets: sets.length,
      totalExerciseLogs: exerciseLogs.length,
      totalAngleMeasurements: angleMeasurements.length,
      totalMedia: media.length,
    };
  }

  private read<DTO, T>(
    data: Record<string, unknown>,
    key: string,
    parser: { parse: (data: unknown) => DTO },
    mapper?: (data: DTO) => T,
  ): T[] {
    if (typeof data === 'object' && data !== null && key in data) {
      const dtos = data[key];

      if (Array.isArray(dtos)) {
        const parsed = Iterator.from(dtos).map((entry) => parser.parse(entry));
        if (mapper) {
          return parsed.map(mapper).toArray();
        }

        return parsed.toArray() as unknown as T[];
      }
    }

    return [];
  }

  private getSessions(data: Record<string, unknown>): Session[] {
    return this.read(data, 'sessions', SessionSchema, SessionMapper.INSTANCE.toDomain);
  }

  private getSets(data: Record<string, unknown>): ExerciseSet[] {
    if (typeof data === 'object' && data !== null && 'sets' in data) {
      const dtos = data['sets'];

      if (Array.isArray(dtos)) {
        return Iterator.from(dtos)
          .map((entry) => ExerciseSetSchema.parse(entry))
          .toArray();
      }
    }

    return [];
  }

  private getExerciseLogs(data: Record<string, unknown>): ExerciseLog[] {
    return this.read(data, 'exerciseLogs', ExerciseLogSchema, ExerciseLogMapper.INSTANCE.toDomain);
  }

  private getAngleMeasurements(data: Record<string, unknown>): AngleMeasurement[] {
    return this.read(
      data,
      'angleMeasurements',
      AngleMeasurementSchema,
      AngleMeasurementMapper.INSTANCE.toDomain,
    );
  }

  private getMedia(data: Record<string, unknown>): ExerciseMedia[] {
    return this.read(data, 'media', ExerciseMediaSchema, ExerciseMediaMapper.INSTANCE.fromDto);
  }

  private handleImages(zipContent: Record<string, Uint8Array<ArrayBuffer>>): Promise<void[]> {
    const images = Object.entries(zipContent)
      .filter((entry) => entry[0].startsWith('images/') && !!entry[1].byteLength)
      .map((entry) => ({
        name: entry[0].replace('images/', ''),
        bytes: entry[1],
      }));

    return Promise.all(
      images.map(async (data) => {
        if (await this.fileService.exists(data.name)) return;
        return this.fileService.persist(data.name, data.bytes);
      }),
    );
  }

  private clearResources(): Promise<void[]> {
    return Promise.all([
      this.sessionRepository.deleteAllSessions(),
      this.setRepository.deleteAllSets(),
      this.exerciseLogRepository.deleteAllLogs(),
      this.angleMeasurementRepository.deleteAllMeasurements(),
      this.mediaRepository.deleteAllMedia(),
    ]);
  }
}
