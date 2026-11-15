import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { CreateDontRequest, Dont, UpdateDontRequest } from '../model/dont.interface';
import { createNanoId } from '@common/function/create-id.function';

interface State {
  donts: Dont[];
}

const initialState: State = {
  donts: [],
};

export const DontsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const getIndex = (id: string): number => store.donts().findIndex((dont) => dont.id === id);

    return {
      logSlip: (id: string) => {
        const index = getIndex(id);
        if (index !== -1) {
          patchState(store, (state) => ({
            ...state,
            donts: state.donts.with(index, {
              ...state.donts[index],
              failures: [...state.donts[index].failures, Temporal.Now.instant()],
            }),
          }));
        }
      },

      create: ({ title }: CreateDontRequest) => {
        const isExisting = store.donts().some((dont) => dont.title === title);

        if (!isExisting) {
          const dont: Dont = {
            id: createNanoId(),
            title,
            createdAt: Temporal.Now.instant(),
            failures: [],
          };
          patchState(store, (state) => ({
            ...state,
            donts: [...state.donts, dont],
          }));
        }
      },

      delete: (id: string) => {
        patchState(store, (state) => ({
          ...state,
          donts: state.donts.filter((dont) => dont.id !== id),
        }));
      },

      update: ({ id, title }: UpdateDontRequest) => {
        const index = getIndex(id);

        if (index !== -1) {
          const updatedDont: Dont = {
            ...store.donts()[index],
            title,
          };
          patchState(store, (state) => ({
            ...state,
            donts: state.donts.with(index, updatedDont),
          }));
        }
      },
    };
  }),
);
