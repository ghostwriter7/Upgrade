import { Session } from '@domain/model/session/session.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject, untracked } from '@angular/core';
import { SessionRepository } from '@persistence/repository/session.repository';
import { DateHelper } from '@common/helper/date.helper';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';

interface State {
  activeDate: string;
  sessionsByDate: Record<string, Session[] | undefined>;
  sessionsByMonthAndYear: Record<string, Record<number, Session[]>>;
}

const initialState: State = {
  activeDate: DateHelper.toLocal(DateHelper.now()).toPlainDate().toString(),
  sessionsByDate: {},
  sessionsByMonthAndYear: {},
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    loading: computed(() => store.sessionsByDate()[store.activeDate()] === undefined),
    activeSessions: computed(() => {
      const activeDate = store.activeDate();
      return activeDate ? store.sessionsByDate()[activeDate] : null;
    }),
  })),
  withMethods((store, sessionRepository = inject(SessionRepository)) => {
    const createCountId = (date: Temporal.Instant | Temporal.PlainDate): string => {
      const zonedDate = DateHelper.toLocal(date);
      return `${zonedDate.year}-${zonedDate.month}`;
    };

    const computeSessionCache = (
      session: Session,
      operation: 'add' | 'remove',
    ): Record<string, Record<number, Session[]>> => {
      const countId = createCountId(session.startedAt);
      const counts = { ...store.sessionsByMonthAndYear() };
      const targetCounts = { ...counts[countId] };
      const dateIndex = session.dayOfMonth;

      if (operation === 'add') {
        targetCounts[dateIndex] = [...(targetCounts[dateIndex] || []), session];
      } else {
        targetCounts[dateIndex] = (targetCounts[dateIndex] || []).filter(
          (s) => s.id !== session.id,
        );
      }

      counts[countId] = targetCounts;
      return counts;
    };

    return {
      setActiveDate: (activeDate: string) => patchState(store, { activeDate }),

      getSessionsByMonthAndYear: async (
        month: number,
        year: number,
      ): Promise<Record<number, Session[]>> => {
        const storeId = createCountId(new Temporal.PlainDate(year, month, 1));
        const cachedEntry = store.sessionsByMonthAndYear()[storeId];
        if (cachedEntry) return cachedEntry;

        const sessions = await sessionRepository.getSessionsByMonthAndYear(month, year);
        patchState(store, (state) => ({
          ...state,
          sessionsByMonthAndYear: {
            ...state.sessionsByMonthAndYear,
            [storeId]: sessions,
          },
        }));
        return sessions;
      },

      updateCache: (session: Session) => {
        const dateId = session.isoDate;
        const sessionsByDate = { ...store.sessionsByDate() };
        const thisDateSessions = sessionsByDate[dateId] || [];

        const existingIndex = thisDateSessions.findIndex(({ id }) => id === session.id);
        if (existingIndex === -1) {
          sessionsByDate[dateId] = [...thisDateSessions, session];
          patchState(store, (state) => ({
            ...state,
            sessionsByDate,
            sessionsByMonthAndYear: computeSessionCache(session, 'add'),
          }));
        } else {
          sessionsByDate[dateId] = thisDateSessions.with(existingIndex, session);
          patchState(store, { sessionsByDate });
        }
      },

      delete: (session: Session) => {
        const dateId = session.isoDate;
        const sessionsByDate = { ...store.sessionsByDate() };
        sessionsByDate[dateId] = sessionsByDate[dateId]?.filter(({ id }) => id !== session.id);

        patchState(store, (state) => ({
          ...state,
          sessionsByDate,
          sessionsByMonthAndYear: computeSessionCache(session, 'remove'),
        }));
      },
    };
  }),
  withHooks((store, queryBus = inject(QueryBus)) => ({
    onInit: () => {
      effect(() => {
        const date = store.activeDate();

        if (date) {
          untracked(async () => {
            const cachedSessions = store.sessionsByDate();

            if (!cachedSessions[date]) {
              const zonedDate = DateHelper.toLocal(date);
              const sessions = await queryBus.execute(new FindSessionsByDateQuery(zonedDate));

              patchState(store, (state) => ({
                ...state,
                sessionsByDate: { ...state.sessionsByDate, [date]: sessions },
              }));
            }
          });
        }
      });
    },
  })),
);
