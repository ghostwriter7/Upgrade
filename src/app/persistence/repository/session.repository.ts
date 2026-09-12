import { Injectable } from '@angular/core';
import { Session } from '@domain/model/session/session.model';
import { GenericRepository } from './generic.repository';
import { SessionDto, SessionSchema } from '../schema/session.schema';
import { SessionMapper } from '../mapper/session/session.mapper';
import { DateHelper } from '@common/helper/date.helper';

const SQL_GET_ALL_SESSIONS = `select s.id          as                 uuid,
                                      s.started_at  as                 startedAt,
                                      s.finished_at as                 finishedAt,
                                      s.rpe,
                                      json_group_array(el.exercise_id) filter (where el.exercise_id is not null) as exerciseIds
                               from session s
                                        left join exercise_log el on el.session_id = s.id
                               group by s.id, s.started_at, s.finished_at, s.rpe;`;

const SQL_GET_ALL_SESSIONS_FOR_RANGE = `select s.id          as                 uuid,
                                               s.started_at  as                 startedAt,
                                               s.finished_at as                 finishedAt,
                                               s.rpe,
                                               json_group_array(el.exercise_id) filter (where el.exercise_id is not null) as exerciseIds
                                        from session s
                                                 left join exercise_log el on el.session_id = s.id
                                        where s.started_at >= :startDate
                                          and s.started_at < :endDate
                                        group by s.id, s.started_at, s.finished_at, s.rpe;`;

@Injectable({ providedIn: 'root' })
export class SessionRepository extends GenericRepository<SessionDto> {
  constructor() {
    super();
  }

  public async getAllSessions(): Promise<Session[]> {
    const results = await this.databaseConnection.queryMany(SQL_GET_ALL_SESSIONS);
    return this.toDomain(results);
  }

  public deleteAllSessions(): Promise<void> {
    return this.databaseConnection.execute(`delete from session where 1 = 1;`);
  }

  public async getSessionsForRange(
    startDate: Temporal.PlainDateTime,
    endDate: Temporal.PlainDateTime,
  ): Promise<Session[]> {
    const results = await this.databaseConnection.queryMany(SQL_GET_ALL_SESSIONS_FOR_RANGE, {
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    });
    return this.toDomain(results);
  }

  public async getSessionsByMonthAndYear(
    month: number,
    year: number,
  ): Promise<Record<number, Session[]>> {
    const startDate = new Temporal.PlainDate(year, month, 1);
    const endDate = startDate.add({ months: 1 });

    const results = await this.databaseConnection.queryMany(SQL_GET_ALL_SESSIONS_FOR_RANGE, {
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    });

    return this.toDomain(results).reduce(
      (sessionsByDay, session) => {
        const { day } = DateHelper.toLocal(session.startedAt);
        sessionsByDay[day] = [...(sessionsByDay[day] ?? []), session];
        return sessionsByDay;
      },
      {} as Record<number, Session[]>,
    );
  }

  public async findAllByDate(date: Temporal.ZonedDateTime): Promise<Session[]> {
    const startOfDayZDT = date.startOfDay();
    const endOfDayZDT = startOfDayZDT.add({ days: 1 });
    const startOfDay = startOfDayZDT.toInstant().toString();
    const endOfDay = endOfDayZDT.toInstant().toString();

    const results = await this.databaseConnection.queryMany(SQL_GET_ALL_SESSIONS_FOR_RANGE, {
      startOfDay,
      endOfDay,
    });

    return this.toDomain(results);
  }

  public async save(session: Session): Promise<void> {
    return this.databaseConnection.execute(
      `insert into session (id, started_at, finished_at, rpe) values (:id, :startedAt, :finishedAt, :rpe)`,
      {
        id: session.uuid,
        startedAt: session.startedAt.toString({ smallestUnit: 'second' }),
        finishedAt: session.finishedAt?.toString({ smallestUnit: 'second' }) ?? null,
        rpe: session.rpe ?? null,
      },
    );
  }

  public async deleteById(sessionId: string): Promise<void> {
    return this.databaseConnection.execute(`delete from session where id = :sessionId`, {
      sessionId,
    });
  }

  private toDomain(results: unknown[]): Session[] {
    return Iterator.from(results)
      .map((dto) => SessionSchema.parse(dto))
      .map(SessionMapper.INSTANCE.toDomain)
      .toArray();
  }
}
