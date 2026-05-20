import { Injectable } from '@angular/core';
import { Session } from '../../domain/model/session.model';
import { GenericRepository } from './generic.repository';
import { StoreName } from './store-name.enum';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session.mapper';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { IndexName } from './index-name.enum';
import { DateHelper } from '../../common/helper/date.helper';

@Injectable({ providedIn: 'root' })
export class SessionRepository extends GenericRepository<SessionDto> {
  constructor() {
    super();
  }

  public async getCountsByMonthAndYear(month: number, year: number): Promise<Record<number, number>> {
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
    const results = await super.findAllBy(StoreName.SESSIONS, (store: IDBObjectStore) => {
      const startOfDay = date.startOfDay();
      const endOfDay = startOfDay.add({ days: 1 });

      const range = IDBKeyRange.bound(
        startOfDay.toInstant().toString(),
        endOfDay.toInstant().toString(),
        false,
        true,
      );

      return store.index(IndexName.StartedAt).getAll(range);
    });
    const dtos: SessionDto[] = results.map((data) => SessionSchema.parse(data));
    return dtos.map(SessionMapper.INSTANCE.toDomain);
  }

  public override async findAll(): Promise<Session[]> {
    const results = await super.findAll(StoreName.SESSIONS);
    const dtos: SessionDto[] = results.map((data) => SessionSchema.parse(data));
    return dtos.map(SessionMapper.INSTANCE.toDomain);
  }

  public save(session: Session): Promise<void> {
    const dto = SessionMapper.INSTANCE.toDto(session);
    return super.put(StoreName.SESSIONS, dto);
  }

  public override delete(sessionId: string): Promise<boolean> {
    return super.delete(StoreName.SESSIONS, sessionId);
  }
}
