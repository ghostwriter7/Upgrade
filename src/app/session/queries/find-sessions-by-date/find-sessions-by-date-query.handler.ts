import { inject, Injectable } from '@angular/core';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { Constructor } from '@common/types/constructor.type';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';
import { SessionRepository } from '@persistence/repository/session.repository';
import { ExerciseLogRepository } from '@persistence/repository/exercise-log.repository';
import { SetRepository } from '@persistence/repository/set.repository';

@Injectable()
export class FindSessionsByDateQueryHandler implements QueryHandler<FindSessionsByDateQuery> {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly exerciseLogRepository = inject(ExerciseLogRepository);
  private readonly setRepository = inject(SetRepository);

  public appliesTo(): Constructor<FindSessionsByDateQuery> {
    return FindSessionsByDateQuery;
  }

  public async query(
    payload: FindSessionsByDateQuery,
  ): Promise<QueryResult<FindSessionsByDateQuery>> {
    const sessions = await this.sessionRepository.findAllByDate(payload.date);

    if (!sessions.length) return [];

    const sessionIds = sessions.map(({ uuid }) => uuid);
    const exerciseLogPromises = Promise.all(
      sessionIds.map((id) => this.exerciseLogRepository.getAllLogsBySessionId(id)),
    );

    const setPromises = Promise.all(
      sessionIds.map((id) =>
        this.setRepository
          .getAllBySessionId(id)
          .then((sets) => Object.groupBy(sets, (set) => set.exerciseId)),
      ),
    );

    const [logs, sets] = await Promise.all([exerciseLogPromises, setPromises]);

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];

      session.exercises = logs[i].sort((a, b) => a.index - b.index);

      for (const log of session.exercises) {
        log.sets = sets[i][log.exerciseId]?.sort((a, b) => a.index - b.index) ?? [];
      }
    }

    return sessions;
  }
}
