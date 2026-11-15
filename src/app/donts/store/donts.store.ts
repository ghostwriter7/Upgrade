import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  CreateDontRequest,
  DayStatus,
  Dont,
  UiDont,
  UpdateDontRequest,
} from '../model/dont.interface';
import { createNanoId } from '@common/function/create-id.function';
import { computed } from '@angular/core';

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

const TIME_ZONE = 'Europe/Warsaw';

function toDate(instant: Temporal.Instant): Temporal.PlainDate {
  return instant.toZonedDateTimeISO(TIME_ZONE).toPlainDate();
}

function calculateStreak(
  dont: Omit<Dont, 'streak'>,
  now = Temporal.Now.plainDateISO(TIME_ZONE),
): number {
  const start = dont.failures.at(-1) ?? dont.createdAt;
  return toDate(start).until(now, { largestUnit: 'day' }).days;
}

function getWeek(dont: Pick<Dont, 'createdAt' | 'failures'>, now = Temporal.Now.plainDateISO(TIME_ZONE)): DayStatus[] {
  const monday = now.subtract({ days: now.dayOfWeek - 1 });

  const slipDates = new Set(dont.failures.map((s) => toDate(s).toString()));
  const createdAt = toDate(dont.createdAt);

  return Array.from({ length: 7 }).map((_, index) => {
    const currentDate = monday.add({ days: index });

    if (Temporal.PlainDate.compare(currentDate, createdAt) < 0) return 'inactive';
    if (Temporal.PlainDate.compare(currentDate, now) > 0) return 'future';

    if (slipDates.has(currentDate.toString())) return 'failure';

    return 'success';
  });
}

function restore(): UiDont[] {
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json).map(toModel)
  }
  return [];
}

export const DontsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    uiDonts: computed(() => {
      const now = Temporal.Now.plainDateISO(TIME_ZONE);

      return store.donts()
        .map((dont) => ({
          ...dont,
          week: getWeek(dont, now),
          streak: calculateStreak(dont, now),
        }))
    }),

    weekSlipCount: computed(() => {
      const now = Temporal.Now.plainDateISO(TIME_ZONE);
      const monday = now.subtract({ days: now.dayOfWeek - 1 });

      return store.donts()
        .reduce((total, currentDont) => {
          const slips = currentDont.failures;
          for (let i = slips.length - 1; i >= 0; i--) {
            const slip = slips[i].toZonedDateTimeISO(TIME_ZONE).toPlainDate();
            if (Temporal.PlainDate.compare(slip, monday) >= 0) {
              total++;
            } else {
              break;
            }
          }

          return total;
        }, 0);
    })
  })),

  withMethods((store) => {
    const getIndex = (id: string): number => store.donts().findIndex((dont) => dont.id === id);

    return {
      logSlip: (id: string) => {
        const index = getIndex(id);
        if (index !== -1) {
          const existing = store.donts()[index];
          const updated = {
            ...existing,
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
          const createdAt = Temporal.Now.instant();
          const dont: Dont = {
            id: createNanoId(),
            title,
            createdAt,
            failures: [],
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
    },
  })),
);
