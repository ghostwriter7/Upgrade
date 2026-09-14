import { signal, WritableSignal } from '@angular/core';
import { Exercise } from '@domain/model/exercise.model';

const drill = (id: string, name: string): Exercise => ({
  id,
  name,
  skillScore: {},
  stats: {
    lastPerformedAt: null,
    lastPerformedHoursAgo: null,
  },
});

export const createExerciseStoreMock = () => ({
  exercises: signal([
    drill('back-squats', 'Back Squats'),
    drill('chin-ups', 'Chin Ups'),
    drill('l-sit', 'L-Sit'),
    drill('pull-ups', 'Pull Ups'),
    drill('side-split', 'Side Split'),
  ]),
});

export interface ExerciseStoreMock {
  exercises: WritableSignal<Exercise[]>;
}
