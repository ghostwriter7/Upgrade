import { Session } from '../domain/model/session.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { SessionRepository } from '../persistence/repository/session.repository';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

interface State {
  sessions: Session[];
  countsByMonthAndYear: Map<string, Map<number, number>>;
}

const initialState: State = {
  sessions: [],
  countsByMonthAndYear: new Map<string, Map<number, number>>(),
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, sessionRepository = inject(SessionRepository)) => ({
    getCountsByMonthAndYear: async (month: number, year: number): Promise<Map<number, number>> => {
      const storeId = `${month}-${year}`;
      const cachedEntry = store.countsByMonthAndYear().get(storeId);
      if (cachedEntry) return cachedEntry;

      const counts = await sessionRepository.getCountsByMonthAndYear(month, year);
      patchState(store, (state) => ({
        ...state,
        countsByMonthAndYear: state.countsByMonthAndYear.set(storeId, counts),
      }));
      return counts;
    },
    getAllSessionsByDate: (date: TemporalType.ZonedDateTime): Promise<Session[]> =>
      sessionRepository.findAllByDate(date),
    save: (session: Session) => {
      patchState(store, { sessions: [...store.sessions(), session] });
      sessionRepository.save(session);
    },
    delete: (sessionId: string) => {
      patchState(store, {
        sessions: store.sessions().filter((session) => session.uuid !== sessionId),
      });
      sessionRepository.delete(sessionId);
    },
  })),
);
