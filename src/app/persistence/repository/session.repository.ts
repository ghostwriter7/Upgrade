import { Injectable } from '@angular/core';
import { Session } from '@domain/model/session/session.model';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session/session.mapper';
import { IndexName } from './index-name.enum';
import { DateHelper } from '@common/helper/date.helper';

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

  public async getSessionsForRange(
    startDate: Temporal.Instant,
    endDate: Temporal.Instant,
  ): Promise<Session[]> {
    const sessionDTOs = await super.findAllBy<SessionDto>(
      StoreName.SESSIONS,
      (store: IDBObjectStore) =>
        store
          .index(IndexName.SessionByStartedAt)
          .getAll(
            IDBKeyRange.bound(
              startDate.toString({ smallestUnit: 'second' }),
              endDate.toString({ smallestUnit: 'second' }),
            ),
          ),
    );
    return Iterator.from(sessionDTOs)
      .map((dto) => SessionSchema.parse(dto))
      .map(SessionMapper.INSTANCE.toDomain)
      .toArray();
  }

  public async getCountsByMonthAndYear(
    month: number,
    year: number,
  ): Promise<Record<number, number>> {
    const request = await super.openKeyCursor(
      StoreName.SESSIONS,
      IndexName.SessionByStartedAt,
      () => {
        const startDate = new Temporal.PlainDate(year, month, 1);
        const endDate = startDate.add({ months: 1 });

        return IDBKeyRange.bound(startDate.toString(), endDate.toString(), false, true);
      },
    );

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
    const sessionDTOs = await super.findAllBy<SessionDto>(
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
    return Iterator.from(sessionDTOs)
      .map((sessionDTO) => SessionSchema.parse(sessionDTO))
      .map(SessionMapper.INSTANCE.toDomain)
      .toArray();
  }

  public async save(session: Session): Promise<IDBValidKey> {
    const dto = SessionMapper.INSTANCE.toDto(session);
    return super.put(StoreName.SESSIONS, dto);
  }

  public async deleteById(sessionId: string): Promise<void> {
    return super.delete(StoreName.SESSIONS, sessionId);
  }
}
