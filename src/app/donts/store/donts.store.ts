import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { CreateDontRequest, Dont, UpdateDontRequest } from '../model/dont.interface';
import { createNanoId } from '@common/function/create-id.function';

interface State {
  donts: Dont[];
}

const initialState: State = {
  donts: [],
};

interface Dto {
  id: string;
  title: string;
  createdAt: number;
  failures: number[];
}

function toDto(dont: Dont): Dto {
  return {
    id: dont.id,
    title: dont.title,
    createdAt: dont.createdAt.epochMilliseconds,
    failures: dont.failures.map((failure) => failure.epochMilliseconds),
  };
}

function toModel(dto: Dto): Omit<Dont, 'streak'> {
  return {
    id: dto.id,
    title: dto.title,
    createdAt: Temporal.Instant.fromEpochMilliseconds(dto.createdAt),
    failures: dto.failures.map((failure) => Temporal.Instant.fromEpochMilliseconds(failure)),
  };
}

const key = 'donts';
function persist(donts: Dont[]): void {
  localStorage.setItem(key, JSON.stringify(donts.map(toDto)));
}

function restore(): Dont[] {
  const json = localStorage.getItem(key);
  if (json) {
    const now = Temporal.Now.instant();
    return Iterator.from(JSON.parse(json))
      .map((entry) => toModel(entry as Dto))
      .map((dont) => {
        const lastFailure = dont.failures.at(-1);

        if (!lastFailure) {
          return {
            ...dont,
            streak: dont.createdAt.until(now).days,
          };
        }

        return {
          ...dont,
          streak: lastFailure.until(now).days,
        };
      })
      .toArray();
  }
  return [];
}

export const DontsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => {
    const getIndex = (id: string): number => store.donts().findIndex((dont) => dont.id === id);

    return {
      logSlip: (id: string) => {
        const index = getIndex(id);
        if (index !== -1) {
          const existing = store.donts()[index];
          const updated = {
            ...existing,
            streak: 0,
            failures: [...existing.failures, Temporal.Now.instant()],
          };
          patchState(store, (state) => ({
            ...state,
            donts: state.donts.with(index, updated),
          }));
          persist(store.donts());
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
            streak: 0,
          };
          patchState(store, (state) => ({
            ...state,
            donts: [...state.donts, dont],
          }));
          persist(store.donts());
        }
      },

      delete: (id: string) => {
        patchState(store, (state) => ({
          ...state,
          donts: state.donts.filter((dont) => dont.id !== id),
        }));
        persist(store.donts());
      },

      update: ({ id, title }: UpdateDontRequest) => {
        const index = getIndex(id);

        if (index !== -1) {
          const updated: Dont = {
            ...store.donts()[index],
            title,
          };
          patchState(store, (state) => ({
            ...state,
            donts: state.donts.with(index, updated),
          }));
          persist(store.donts());
        }
      },
    };
  }),

  withHooks((store) => ({
    onInit: () => {
      const donts = restore();
      patchState(store, { donts });
    }
  }))
);
