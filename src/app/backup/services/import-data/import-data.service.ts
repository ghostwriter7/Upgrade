import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { ExerciseLog, Session } from '../../../domain/model/session.model';
import { SessionSchema } from '../../../persistence/schema/session.schema';
import { SessionMapper } from '../../../persistence/mapper/session/session.mapper';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';
import { ExerciseSetMapper } from '../../../persistence/mapper/exercise-set/exercise-set.mapper';
import { ExerciseSetSchema } from '../../../persistence/schema/set.schema';
import { ExerciseLogSchema } from '../../../persistence/schema/exercise-log.schema';
import { ExerciseLogMapper } from '../../../persistence/mapper/exercise-entry/exercise-log.mapper';
import { ExerciseLogRepository } from '../../../persistence/repository/exercise-log.repository';

@Injectable({ providedIn: 'root' })
export class ImportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);

  public async importData(): Promise<void> {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });
    const file = await handle.getFile();
    const bytes = await file.bytes();
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);

    const sessions = this.getSessions(data);
    const sets = this.getSets(data);
    const exerciseLogs = this.getExerciseLogs(data);

    await Promise.all([
      this.sessionRepository.deleteAllSessions(),
      this.setRepository.deleteAllSets(),
      this.exerciseLogRepository.deleteAllLogs(),
    ]);

    await Promise.all([
      ...sessions.map((session) => this.sessionRepository.save(session)),
      ...sets.map((set) => this.setRepository.upsertSet(set)),
      ...exerciseLogs.map((exerciseLog) => this.exerciseLogRepository.saveLog(exerciseLog)),
    ]);
  }

  private read<DTO, T>(data: Record<string, unknown>, key: string, parser: { parse: (data: unknown) => DTO }, mapper: (data: DTO) => T): T[] {
    if (typeof data === 'object' && data !== null && key in data) {
      const dtos = data[key];

      if (Array.isArray(dtos)) {
        return Iterator.from(dtos)
          .map((entry) => parser.parse(entry))
          .map(mapper)
          .toArray();
      }
    }

    return [];
  }

  private getSessions(data: Record<string, unknown>): Session[] {
    return this.read(data, 'sessions', SessionSchema, SessionMapper.INSTANCE.toDomain);
  }

  private getSets(data: Record<string, unknown>): ExerciseSet[] {
    return this.read(data, 'sets', ExerciseSetSchema, ExerciseSetMapper.INSTANCE.toDomain);
  }

  private getExerciseLogs(data: Record<string, unknown>): ExerciseLog[] {
    return this.read(data, 'exerciseLogs', ExerciseLogSchema, ExerciseLogMapper.INSTANCE.toDomain);
  }
}
