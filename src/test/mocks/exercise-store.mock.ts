import { signal, WritableSignal } from '@angular/core';
import { Exercise } from '@domain/model/exercise.model';

export const createExerciseStoreMock = () => ({
  exercises: signal([
    new Exercise('back-squats', 'Back Squats'),
    new Exercise('chin-ups', 'Chin Ups'),
    new Exercise('l-sit', 'L-Sit'),
    new Exercise('pull-ups', 'Pull Ups'),
    new Exercise('side-split', 'Side Split'),
  ])
});

export interface ExerciseStoreMock {
  exercises: WritableSignal<Exercise[]>
}
