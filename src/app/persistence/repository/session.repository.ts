import { Injectable } from '@angular/core';
import { Session } from '../../domain/model/session.model';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session/session.mapper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { IndexName } from './index-name.enum';
import { DateHelper } from '../../common/helper/date.helper';
import { ExerciseSetDto, ExerciseSetSchema } from '../schema/set.schema';
import { ExerciseSetMapper } from '../mapper/exercise-set/exercise-set.mapper';

@Injectable({ providedIn: 'root' })
export class SessionRepository extends GenericRepository<SessionDto> {
  constructor() {
    super();
  }

  public async getCountsByMonthAndYear(
    month: number,
    year: number,
  ): Promise<Record<number, number>> {
    const request = await super.openKeyCursor(StoreName.SESSIONS, IndexName.StartedAt, () => {
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

  public async findAllByDate(date: TemporalType.ZonedDateTime): Promise<Session[]> {
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

        return store.index(IndexName.StartedAt).getAll(range);
      },
    );

    const sessionIds = results.map((dto) => dto.uuid);

    const setDTOs: ExerciseSetDto[][] = await Promise.all(
      sessionIds.map((sessionId) =>
        super
          .findAllBy<ExerciseSetDto>(StoreName.SETS, (store: IDBObjectStore) =>
            store.index(IndexName.SetBySession).getAll(sessionId),
          )
          .then((data) => data.map((entry) => ExerciseSetSchema.parse(entry))),
      ),
    );

    const sessionDTOs: SessionDto[] = results.map((data) => SessionSchema.parse(data));
    const sessions = sessionDTOs.map(SessionMapper.INSTANCE.toDomain);

    return sessions.map((session, index) => {
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

  public override async delete(sessionId: string): Promise<boolean> {
    const transaction = await super.createWriteTransaction([StoreName.SESSIONS, StoreName.SETS]);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = (): void => resolve(true);
      transaction.onerror = (): void => reject(transaction.error);
      transaction.onabort = (): void => reject(transaction.error);

      transaction.objectStore(StoreName.SESSIONS).delete(sessionId);

      const setStore = transaction.objectStore(StoreName.SETS);
      const setBySessionIndex = setStore.index(IndexName.SetBySession);

      const cursorRequest = setBySessionIndex.openCursor(sessionId);
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;

        if (!cursor) return;

        cursor.delete();
        cursor.continue();
      };
    });
  }
}
