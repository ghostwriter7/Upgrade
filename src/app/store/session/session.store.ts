import { Session } from '../../domain/model/session.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject, untracked } from '@angular/core';
import { SessionRepository } from '../../persistence/repository/session.repository';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { DateHelper } from '../../common/helper/date.helper';

interface State {
  activeDate: string;
  sessionsByDate: Record<string, Session[] | undefined>;
  countsByMonthAndYear: Record<string, Record<number, number>>;
}

const initialState: State = {
  activeDate: DateHelper.toLocal(DateHelper.now()).toPlainDate().toString(),
  sessionsByDate: {},
  countsByMonthAndYear: {},
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
    const createCountId = (date: TemporalType.Instant | TemporalType.PlainDate): string => {
      const zonedDate = DateHelper.toLocal(date);
      return `${zonedDate.year}-${zonedDate.month}`;
    };

    const computeCounts = (session: Session, change: number ): Record<string, Record<number, number>> => {
      const countId = createCountId(session.startedAt);
      const counts = { ...store.countsByMonthAndYear() };
      const targetCounts = counts[countId] ?? {};
      const dateIndex = session.dayOfMonth;
      targetCounts[dateIndex] = Math.max(0, (targetCounts[dateIndex] ?? 0) + change);
      counts[countId] = targetCounts;
      return counts;
    }

    return {
      setActiveDate: (activeDate: string) => patchState(store, { activeDate }),

      getCountsByMonthAndYear: async (
        month: number,
        year: number,
      ): Promise<Record<number, number>> => {
        const storeId = createCountId(new Temporal.PlainDate(year, month, 1));
        const cachedEntry = store.countsByMonthAndYear()[storeId];
        if (cachedEntry) return cachedEntry;

        const counts = await sessionRepository.getCountsByMonthAndYear(month, year);
        patchState(store, (state) => ({
          ...state,
          countsByMonthAndYear: {
            ...state.countsByMonthAndYear,
            [storeId]: counts,
          },
        }));
        return counts;
      },

      save: (session: Session) => {
        const dateId = session.isoDate!;
        const sessionsByDate = { ...store.sessionsByDate() };
        const thisDateSessions = sessionsByDate[dateId] || [];
        sessionsByDate[dateId] = [...thisDateSessions, session];

        patchState(store, (state) => ({
          ...state,
          sessionsByDate,
          countsByMonthAndYear: computeCounts(session, +1),
        }));
        sessionRepository.save(session);
      },

      delete: (session: Session) => {
        const dateId = session.isoDate!;
        const sessionsByDate = { ...store.sessionsByDate() };
        sessionsByDate[dateId] = sessionsByDate[dateId]?.filter(
          ({ uuid }) => uuid !== session.uuid,
        );

        patchState(store, (state) => ({
          ...state,
          sessionsByDate,
          countsByMonthAndYear: computeCounts(session, - 1),
        }));
        sessionRepository.delete(session.uuid);
      },
    };
  }),
  withHooks((store, sessionRepository = inject(SessionRepository)) => ({
    onInit: () => {
      effect(async () => {
        const date = store.activeDate();

        if (date) {
          const cachedSessions = untracked(store.sessionsByDate);

          if (!cachedSessions[date]) {
            const zonedDate = DateHelper.toLocal(date);

            const sessionsByDate = { ...cachedSessions };
            sessionsByDate[date] = await sessionRepository.findAllByDate(zonedDate);

            patchState(store, (state) => ({
              ...state,
              sessionsByDate,
            }));
          }
        }
      });
    },
  })),
);
