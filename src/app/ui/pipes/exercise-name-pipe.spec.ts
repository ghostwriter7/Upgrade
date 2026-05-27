import { ExerciseNamePipe } from './exercise-name-pipe';
import { beforeAll, Mock, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseStore } from '../../store/exercises.store';

describe('ExerciseNamePipe', () => {
  let pipe: ExerciseNamePipe;
  let exerciseStore: { getExerciseById: Mock };

  beforeAll(() => {
    exerciseStore = { getExerciseById: vi.fn() };
    TestBed.configureTestingModule({
      providers: [ExerciseNamePipe, { provide: ExerciseStore, useValue: exerciseStore }],
    });
    pipe = TestBed.inject(ExerciseNamePipe);
  });

  it('create an instance', () => expect(pipe).toBeTruthy());

  test.each([
    { value: 'chin-ups', returnedValue: { name: 'Chin-ups' }, expected: 'Chin-ups' },
    { value: 'chin-ups', returnedValue: undefined, expected: 'Unknown Exercise' },
  ])('should return correct exercise name for %s', ({ value, returnedValue, expected }) => {
    exerciseStore.getExerciseById.mockReturnValueOnce(returnedValue);

    expect(pipe.transform(value)).toBe(expected);
  });
});
