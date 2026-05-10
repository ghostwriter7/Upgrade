import { Session } from '../domain/model/session.model';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { SessionRepository } from '../persistence/session.repository';

interface State {
  sessions: Session[];
}

const initialState: State = {
  sessions: [],
};

export const SessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    sessionsByDate: computed(() =>
      store.sessions().reduce((lookup, session) => {
        const dateId = session.startedAt?.slice(0, 10)!;

        const existingSessions = lookup.get(dateId) ?? [];
        lookup.set(dateId, [...existingSessions, session]);

        return lookup;
      }, new Map<string, Session[]>()),
    ),
  })),
  withMethods((store, sessionRepository = inject(SessionRepository)) => ({
    save: (session: Session) => {
      patchState(store, { sessions: [...store.sessions(), session] });
      sessionRepository.save(session);
    },
  })),
  withHooks((store, sessionRepository = inject(SessionRepository)) => ({
    onInit: () => {
      sessionRepository.findAll().then((sessions) => patchState(store, { sessions }));
    },
  })),
);
