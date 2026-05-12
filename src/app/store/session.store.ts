import { Session } from '../domain/model/session.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { SessionRepository } from '../persistence/repository/session.repository';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { DateHelper } from '../common/helper/date.helper';

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
    activeSessions: computed(() => store.sessionsByDate()[store.activeDate()]),
  })),
  withMethods((store, sessionRepository = inject(SessionRepository)) => {
    const createCountId = (date: TemporalType.Instant | TemporalType.ZonedDateTime): string => {
      if (date instanceof Temporal.Instant) {
        const zonedDate = DateHelper.toLocal(date);
        return `${zonedDate.year}-${zonedDate.month}`;
      }
      return `${date.year}-${date.month}`;
    };

    return {
      setActiveDate: (activeDate: string) => patchState(store, { activeDate }),

      getCountsByMonthAndYear: async (
        month: number,
        year: number,
      ): Promise<Record<number, number>> => {
        const date = new Temporal.PlainDate(year, month, 1).toZonedDateTime(DateHelper.WARSAW_TIMEZONE);
        const storeId = createCountId(date);
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
        const countId = createCountId(session.startedAt);
        const countsByMonthAndYear = store.countsByMonthAndYear();
        const dayIndex = session.day;
        const targetCounts = countsByMonthAndYear[countId] || {};
        targetCounts[dayIndex] = (targetCounts[dayIndex] || 0) + 1;

        const dateId = session.date!;
        const sessionsByDate = { ...store.sessionsByDate() };
        const thisDateSessions = sessionsByDate[dateId] || [];
        sessionsByDate[dateId] = [...thisDateSessions, session];

        patchState(store, (state) => ({
          ...state,
          sessionsByDate,
          countsByMonthAndYear: {
            ...state.countsByMonthAndYear,
            [countId]: targetCounts,
          },
        }));
        sessionRepository.save(session);
      },

      delete: (session: Session) => {
        const countId = createCountId(session.startedAt);
        const countsByMonthAndYear = { ...store.countsByMonthAndYear()};
        const dayIndex = session.day;
        const targetCounts = countsByMonthAndYear[countId];
        targetCounts[dayIndex] = (targetCounts[dayIndex] || 1) - 1;

        const dateId = session.date!;
        const sessionsByDate = { ...store.sessionsByDate() };
        sessionsByDate[dateId] = sessionsByDate[dateId]?.filter(
          ({ uuid }) => uuid !== session.uuid,
        );

        patchState(store, (state) => ({
          ...state,
          sessionsByDate,
          countsByMonthAndYear,
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
          const cachedSessions = { ...store.sessionsByDate()};

          if (!cachedSessions[date]) {

            const zonedDate = Temporal.PlainDate.from(date).toZonedDateTime({
              plainTime: '00:00',
              timeZone: DateHelper.WARSAW_TIMEZONE
            });

            cachedSessions[date] = await sessionRepository.findAllByDate(zonedDate);

            patchState(store, (state) => ({
              ...state,
              sessionsByDate: cachedSessions,
            }));
          }
        }
      });
    },
  })),
);
