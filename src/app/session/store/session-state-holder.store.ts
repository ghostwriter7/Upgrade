import { Session } from '../../domain/model/session.model';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface State {
  session: Session | null;
}

const initialState: State = {
  session: null,
};

export const SessionStateHolder = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isSessionInvalid: computed(() => store.session()!.isEmpty),
    isUnfinished: computed(() => !store.session()!.finishedAt),
  })),
  withMethods((store) => ({
    set: (session: Session | null) => patchState(store, { session }),
  })),
);
