import { inject, Injectable } from '@angular/core';
import { SessionRepository } from '../../../persistence/repository/session.repository';
import { SetRepository } from '../../../persistence/repository/set.repository';
import { Session } from '../../../domain/model/session.model';
import { SessionSchema } from '../../../persistence/schema/session.schema';
import { SessionMapper } from '../../../persistence/mapper/session/session.mapper';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';
import { ExerciseSetMapper } from '../../../persistence/mapper/exercise-set/exercise-set.mapper';
import { ExerciseSetSchema } from '../../../persistence/schema/set.schema';

@Injectable({ providedIn: 'root' })
export class ImportDataService {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly setRepository = inject(SetRepository);

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

    await Promise.all([
      this.sessionRepository.deleteAllSessions(),
      this.setRepository.deleteAllSets(),
    ]);

    await Promise.all([
      ...sessions.map((session) => this.sessionRepository.save(session)),
      ...sets.map((set) => this.setRepository.upsertSet(set)),
    ]);
  }

  private getSessions(data: unknown): Session[] {
    if (typeof data === 'object' && data !== null && 'sessions' in data) {
      const sessions = data.sessions;

      if (Array.isArray(sessions)) {
        return Iterator.from(sessions)
          .map((entry) => SessionSchema.parse(entry))
          .map(SessionMapper.INSTANCE.toDomain)
          .toArray();
      }
    }

    return [];
  }

  private getSets(data: unknown): ExerciseSet[] {
    if (typeof data === 'object' && data !== null && 'sets' in data) {
      const sets = data.sets;

      if (Array.isArray(sets)) {
        return Iterator.from(sets)
          .map((entry) => ExerciseSetSchema.parse(entry))
          .map(ExerciseSetMapper.INSTANCE.toDomain)
          .toArray();
      }
    }

    return [];
  }
}
