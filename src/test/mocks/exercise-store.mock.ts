import { signal, WritableSignal } from '@angular/core';
import { Exercise } from '@domain/model/exercise.model';

const exercise = (id: string, name: string): Exercise => ({
  id,
  name,
  unitsOfMeasurement: null,
  stats: {
    lastPerformedAt: null,
    lastPerformedHoursAgo: null,
  },
  isFavourite: false,
  skillIds: [],
});

export const createExerciseStoreMock = () => ({
  exercises: signal([
    exercise('back-squats', 'Back Squats'),
    exercise('chin-ups', 'Chin Ups'),
    exercise('l-sit', 'L-Sit'),
    exercise('pull-ups', 'Pull Ups'),
    exercise('side-split', 'Side Split'),
  ]),
});

export interface ExerciseStoreMock {
  exercises: WritableSignal<Exercise[]>;
}
