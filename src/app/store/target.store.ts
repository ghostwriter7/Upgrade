import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Target } from '@domain/model/target';
import { TargetRepository } from '@persistence/repository/target.repository';
import { TargetResult } from '@target/components/target-form/target-result';
import { createNanoId } from '@common/function/create-uuid.function';

function createTarget(edited: Target | null, targetResult: TargetResult): Target {
  if (edited) {
    return { ...edited, ...targetResult };
  }
  return { ...targetResult, id: createNanoId(), createdAt: Temporal.Now.instant() };
}

interface State {
  targets: Target[];
  editedTarget: Target | null;
  showForm: boolean;
}

const initialState: State = {
  targets: [],
  editedTarget: null,
  showForm: false,
};

export const TargetStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, targetRepository = inject(TargetRepository)) => ({
    delete: (target: Target) => {
      if (confirm(`Are you sure you want to remove "${target.name}"?`)) {
        patchState(store, (state) => ({
          ...state,
          targets: state.targets.filter(({ id }) => id !== target.id),
        }));
        targetRepository.deleteById(target.id);
      }
    },

    save: (targetResult: TargetResult) => {
      const edited = store.editedTarget();
      const target = createTarget(edited, targetResult);

      patchState(store, (state) => ({
        ...state,
        showForm: false,
        targets: (edited
          ? state.targets.with(
              state.targets.findIndex(({ id }) => id === target.id),
              target,
            )
          : [...state.targets, target]
        ).sort((a, b) => a.name.localeCompare(b.name)),
      }));

      targetRepository.save(target);
    },

    initEdit: (target: Target) =>
      patchState(store, {
        editedTarget: target,
        showForm: true,
      }),

    setShowForm: (showForm: boolean) => patchState(store, { showForm, editedTarget: null }),
  })),
  withHooks((store, targetRepository = inject(TargetRepository)) => ({
    onInit: () => {
      targetRepository.getAllTargets().then((targets) => patchState(store, { targets }));
    },
  })),
);
