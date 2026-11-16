import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  CreateHabitRequest,
  DayStatus,
  Habit,
  UiHabit,
  UpdateHabitRequest,
} from '../model/habit.interface';
import { createNanoId } from '@common/function/create-id.function';
import { computed } from '@angular/core';

interface State {
  habits: Habit[];
}

const initialState: State = {
  habits: [],
};

interface Dto {
  id: string;
  title: string;
  createdAt: number;
  failures: number[];
}

function toDto(habit: Habit): Dto {
  return {
    id: habit.id,
    title: habit.title,
    createdAt: habit.createdAt.epochMilliseconds,
    failures: habit.failures.map((failure) => failure.epochMilliseconds),
  };
}

function toModel(dto: Dto): Omit<Habit, 'streak'> {
  return {
    id: dto.id,
    title: dto.title,
    createdAt: Temporal.Instant.fromEpochMilliseconds(dto.createdAt),
    failures: dto.failures.map((failure) => Temporal.Instant.fromEpochMilliseconds(failure)),
  };
}

const key = 'donts';
function persist(habits: Habit[]): void {
  localStorage.setItem(key, JSON.stringify(habits.map(toDto)));
}

const TIME_ZONE = 'Europe/Warsaw';

function toDate(instant: Temporal.Instant): Temporal.PlainDate {
  return instant.toZonedDateTimeISO(TIME_ZONE).toPlainDate();
}

function calculateStreak(
  habit: Omit<Habit, 'streak'>,
  now = Temporal.Now.plainDateISO(TIME_ZONE),
): number {
  const start = habit.failures.at(-1) ?? habit.createdAt;
  return toDate(start).until(now, { largestUnit: 'day' }).days;
}

function getWeek(habit: Pick<Habit, 'createdAt' | 'failures'>, now = Temporal.Now.plainDateISO(TIME_ZONE)): DayStatus[] {
  const monday = now.subtract({ days: now.dayOfWeek - 1 });

  const slipDates = new Set(habit.failures.map((s) => toDate(s).toString()));
  const createdAt = toDate(habit.createdAt);

  return Array.from({ length: 7 }).map((_, index) => {
    const currentDate = monday.add({ days: index });

    if (Temporal.PlainDate.compare(currentDate, createdAt) < 0) return 'inactive';
    if (Temporal.PlainDate.compare(currentDate, now) > 0) return 'future';

    if (slipDates.has(currentDate.toString())) return 'failure';

    return 'success';
  });
}

function restore(): UiHabit[] {
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json).map(toModel);
  }
  return [];
}

export const HabitStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    uiHabits: computed(() => {
      const now = Temporal.Now.plainDateISO(TIME_ZONE);

      return store.habits()
        .map((habit) => ({
          ...habit,
          week: getWeek(habit, now),
          streak: calculateStreak(habit, now),
        }));
    }),

    weekSlipCount: computed(() => {
      const now = Temporal.Now.plainDateISO(TIME_ZONE);
      const monday = now.subtract({ days: now.dayOfWeek - 1 });

      return store.habits()
        .reduce((total, currentHabit) => {
          const slips = currentHabit.failures;
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
    }),
  })),

  withMethods((store) => {
    const getIndex = (id: string): number => store.habits().findIndex((habit) => habit.id === id);

    return {
      logSlip: (id: string) => {
        const index = getIndex(id);
        if (index !== -1) {
          const existing = store.habits()[index];
          const updated = {
            ...existing,
            failures: [...existing.failures, Temporal.Now.instant()],
          };
          patchState(store, (state) => ({
            ...state,
            habits: state.habits.with(index, updated),
          }));
          persist(store.habits());
        }
      },

      create: ({ title }: CreateHabitRequest) => {
        const isExisting = store.habits().some((habit) => habit.title === title);

        if (!isExisting) {
          const createdAt = Temporal.Now.instant();
          const habit: Habit = {
            id: createNanoId(),
            title,
            createdAt,
            failures: [],
          };
          patchState(store, (state) => ({
            ...state,
            habits: [...state.habits, habit],
          }));
          persist(store.habits());
        }
      },

      delete: (id: string) => {
        patchState(store, (state) => ({
          ...state,
          habits: state.habits.filter((habit) => habit.id !== id),
        }));
        persist(store.habits());
      },

      update: ({ id, title }: UpdateHabitRequest) => {
        const index = getIndex(id);

        if (index !== -1) {
          const updated: Habit = {
            ...store.habits()[index],
            title,
          };
          patchState(store, (state) => ({
            ...state,
            habits: state.habits.with(index, updated),
          }));
          persist(store.habits());
        }
      },
    };
  }),

  withHooks((store) => ({
    onInit: () => {
      const habits = restore();
      patchState(store, { habits });
    },
  })),
);
