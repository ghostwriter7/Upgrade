import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Target } from '@domain/model/target';
import { TargetRepository } from '@persistence/repository/target.repository';

interface State {
  targets: Target[];
}

const initialState: State = {
  targets: [],
};

export const TargetStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, targetRepository = inject(TargetRepository)) => ({
    save: (target: Target) => {
      patchState(store, (state) => ({
        ...state,
        targets: [...state.targets, target].sort((a, b) => a.name.localeCompare(b.name)),
      }));

      targetRepository.save(target);
    },
  })),
  withHooks((store, targetRepository = inject(TargetRepository)) => ({
    onInit: () => {
      targetRepository.getAllTargets().then((targets) => patchState(store, { targets }));
    },
  })),
);
