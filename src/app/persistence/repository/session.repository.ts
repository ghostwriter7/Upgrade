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

  public async getLastSessions(count: number): Promise<Session[]> {
    const transaction = await this.createReadTransaction(StoreName.SESSIONS);
    const store = transaction.objectStore(StoreName.SESSIONS);
    const request = store.index(IndexName.SessionByStartedAt).openCursor(null, 'prev');

    const sessionDTOs: SessionDto[] = await new Promise((resolve, reject) => {
      const results: SessionDto[] = [];
      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve(results);
        } else {
          results.push(cursor.value);
          if (results.length === count) resolve(results);

          cursor.continue();
        }
      };
      request.onerror = () => reject(request.error!);
    });

    return sessionDTOs.map(SessionMapper.INSTANCE.toDomain);
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

  public async getSessionsByMonthAndYear(
    month: number,
    year: number,
  ): Promise<Record<number, Session[]>> {
    const request = await super.openCursor(StoreName.SESSIONS, IndexName.SessionByStartedAt, () => {
      const startDate = new Temporal.PlainDate(year, month, 1);
      const endDate = startDate.add({ months: 1 });

      return IDBKeyRange.bound(startDate.toString(), endDate.toString(), false, true);
    });

    return new Promise((resolve, reject) => {
      const sessions: Record<number, Session[]> = {};

      request.onsuccess = () => {
        const cursor = request.result;

        if (!cursor) {
          resolve(sessions);
          return;
        }

        const startedAt = cursor.key;

        if (typeof startedAt !== 'string') throw new Error('Invalid cursor key type');

        const { day } = DateHelper.toLocal(DateHelper.from(startedAt));

        sessions[day] = [...(sessions[day] ?? []), cursor.value];

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
