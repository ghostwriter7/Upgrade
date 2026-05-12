import { Session } from '../domain/model/session.model';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { SessionRepository } from '../persistence/repository/session.repository';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';

interface State {
  sessions: Session[];
}

const initialState: State = {
  sessions: [],
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, sessionRepository = inject(SessionRepository)) => ({
    getCountsByMonthAndYear: (month: number, year: number): Promise<Map<number, number>> =>
      sessionRepository.getCountsByMonthAndYear(month, year),
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
