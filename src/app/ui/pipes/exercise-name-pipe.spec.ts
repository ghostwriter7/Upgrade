import { ExerciseNamePipe } from './exercise-name-pipe';
import { beforeAll, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseStore } from '../../store/exercises.store';

describe('ExerciseNamePipe', () => {
  let pipe: ExerciseNamePipe;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        ExerciseNamePipe,
        { provide: ExerciseStore, useValue: { getExerciseById: vi.fn() } },
      ],
    });
    pipe = TestBed.inject(ExerciseNamePipe);
  });

  it('create an instance', () => expect(pipe).toBeTruthy());
});
