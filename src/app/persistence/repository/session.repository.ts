import { Injectable } from '@angular/core';
import { Session } from '../../domain/model/session.model';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session/session.mapper';
import { IndexName } from './index-name.enum';
import { DateHelper } from '../../common/helper/date.helper';
import { ExerciseSetDto, ExerciseSetSchema } from '../schema/set.schema';
import { ExerciseSetMapper } from '../mapper/exercise-set/exercise-set.mapper';
import { ExerciseLogDto, ExerciseLogSchema } from '../schema/exercise-log.schema';
import { ExerciseLogMapper } from '../mapper/exercise-entry/exercise-log.mapper';

@Injectable({ providedIn: 'root' })
export class SessionRepository extends GenericRepository<SessionDto> {
  constructor() {
    super();
  }

  public async getAllSessions(): Promise<Session[]> {
    const sessions = await super.findAll(StoreName.SESSIONS);
    return sessions.map(SessionMapper.INSTANCE.toDomain);
  }

  public deleteAllSessions(): Promise<void> {
    return super.deleteAll(StoreName.SESSIONS);
  }

  public async getCountsByMonthAndYear(
    month: number,
    year: number,
  ): Promise<Record<number, number>> {
    const request = await super.openKeyCursor(StoreName.SESSIONS, IndexName.SessionByStartedAt, () => {
      const startDate = new Temporal.PlainDate(year, month, 1);
      const endDate = startDate.add({ months: 1 });

      return IDBKeyRange.bound(startDate.toString(), endDate.toString(), false, true);
    });

    return new Promise((resolve, reject) => {
      const counts: Record<number, number> = {};

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve(counts);
          return;
        }

        const startedAt = cursor.key;

        if (typeof startedAt !== 'string') throw new Error('Invalid cursor key type');

        const { day } = DateHelper.toLocal(DateHelper.from(startedAt));

        counts[day] = (counts[day] ?? 0) + 1;

        cursor.continue();
      };

      request.onerror = () => reject(request.error!);
    });
  }

  public async findAllByDate(date: Temporal.ZonedDateTime): Promise<Session[]> {
    const results = await super.findAllBy<SessionDto>(
      StoreName.SESSIONS,
      (store: IDBObjectStore) => {
        const startOfDay = date.startOfDay();
        const endOfDay = startOfDay.add({ days: 1 });

        const range = IDBKeyRange.bound(
          startOfDay.toInstant().toString(),
          endOfDay.toInstant().toString(),
          false,
          true,
        );

        return store.index(IndexName.SessionByStartedAt).getAll(range);
      },
    );

    const sessionIds = results.map((dto) => dto.uuid);

    const exerciseLogDTOs: ExerciseLogDto[][] = await Promise.all(
      sessionIds.map((sessionId) =>
        super
          .findAllBy(StoreName.EXERCISE_LOGS, (store: IDBObjectStore) =>
            store.index(IndexName.ExerciseLogsBySessionId).getAll(sessionId),
          )
          .then((data) => data.map((entry) => ExerciseLogSchema.parse(entry))),
      ),
    );

    const setDTOs: ExerciseSetDto[][] = await Promise.all(
      sessionIds.map((sessionId) =>
        super
          .findAllBy<ExerciseSetDto>(StoreName.SETS, (store: IDBObjectStore) =>
            store.index(IndexName.SetBySessionId).getAll(sessionId),
          )
          .then((data) => data.map((entry) => ExerciseSetSchema.parse(entry))),
      ),
    );

    const sessionDTOs: SessionDto[] = results.map((data) => SessionSchema.parse(data));
    const sessions = sessionDTOs.map(SessionMapper.INSTANCE.toDomain);

    return sessions.map((session, index) => {
      const exerciseLogs = exerciseLogDTOs[index];
      session.exercises = exerciseLogs.map(ExerciseLogMapper.INSTANCE.toDomain);
      const sets = setDTOs[index];
      const setByExerciseId = Object.groupBy(sets, (set) => set.exerciseId);
      for (const exerciseId of Object.keys(setByExerciseId)) {
        for (const set of setByExerciseId[exerciseId]!) {
          session = session.addSet(ExerciseSetMapper.INSTANCE.toDomain(set));
        }
      }
      return session;
    });
  }

  public async save(session: Session): Promise<IDBValidKey> {
    const dto = SessionMapper.INSTANCE.toDto(session);
    return super.put(StoreName.SESSIONS, dto);
  }

  public async deleteById(sessionId: string): Promise<void> {
    return super.delete(StoreName.SESSIONS, sessionId);
  }
}
