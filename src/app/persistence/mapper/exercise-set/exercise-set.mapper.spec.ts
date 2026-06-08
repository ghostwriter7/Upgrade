import { describe, expect, test } from 'vitest';
import { ExerciseSetMapper } from './exercise-set.mapper';
import { ExerciseSetDto } from '../../schema/set.schema';
import {
  BodyweightSet,
  BodyweightSetBuilder,
  ExerciseSet,
  ExerciseSetType,
  IsoSet,
  IsoSetBuilder,
  WeightedSet,
  WeightSetBuilder,
} from '@domain/model/exercise-set/exercise-set.model';
import { createNanoId } from '@common/function/create-uuid.function';

describe('ExerciseSetMapper', () => {
  const mapper = ExerciseSetMapper.INSTANCE;

  describe('toDomain', () => {
    test('should map a bodyweight DTO to BodyweightSet', () => {
      const dto: ExerciseSetDto = {
        sessionId: 'any-session-id',
        exerciseId: 'any-exercise-id',
        id: createNanoId(),
        reps: 10,
        type: 'bodyweight',
        index: 4,
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(BodyweightSet);
      expect(domain).toMatchObject({
        index: dto.index,
        reps: dto.reps,
        type: dto.type,
        id: dto.id,
        exerciseId: dto.exerciseId,
        sessionId: dto.sessionId,
      });
    });

    test('should map a weight DTO to WeightedSet', () => {
      const dto: ExerciseSetDto = {
        sessionId: 'any-session-id',
        exerciseId: 'any-exercise-id',
        id: createNanoId(),
        reps: 10,
        weight: 20,
        type: 'weight',
        index: 4,
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(WeightedSet);
      expect(domain).toMatchObject({
        index: dto.index,
        reps: dto.reps,
        type: dto.type,
        id: dto.id,
        weight: dto.weight,
        exerciseId: dto.exerciseId,
        sessionId: dto.sessionId,
      });
    });

    test('should map an iso DTO to IsoSet', () => {
      const dto: ExerciseSetDto = {
        sessionId: 'any-session-id',
        exerciseId: 'any-exercise-id',
        id: createNanoId(),
        duration: 30,
        weight: 20,
        type: 'iso',
        index: 4,
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(IsoSet);
      expect(domain).toMatchObject({
        index: dto.index,
        duration: dto.duration,
        type: dto.type,
        id: dto.id,
        weight: dto.weight,
        exerciseId: dto.exerciseId,
        sessionId: dto.sessionId,
      });
    });
  });

  describe('toDto', () => {
    test('should map BodyweightSet to a bodyweight DTO', () => {
      const set = new BodyweightSetBuilder()
        .withId(createNanoId())
        .withSessionId('any-session-id')
        .withExerciseId('any-exercise-id')
        .withIndex(4)
        .withReps(25)
        .build();

      const dto = mapper.toDto(set);

      expect(dto).toMatchObject({
        sessionId: set.sessionId,
        exerciseId: set.exerciseId,
        id: set.id,
        reps: set.reps,
        type: 'bodyweight',
      });
    });

    test('should map WeightedSet to a weight DTO', () => {
      const set = new WeightSetBuilder()
        .withId(createNanoId())
        .withSessionId('any-session-id')
        .withExerciseId('any-exercise-id')
        .withIndex(4)
        .withReps(25)
        .withWeight(50)
        .build();

      const dto = mapper.toDto(set);

      expect(dto).toMatchObject({
        sessionId: set.sessionId,
        exerciseId: set.exerciseId,
        id: set.id,
        reps: set.reps,
        type: 'weight',
        weight: set.weight,
      });
    });

    test('should map IsoSet to an iso DTO', () => {
      const set = new IsoSetBuilder()
        .withId(createNanoId())
        .withSessionId('any-session-id')
        .withExerciseId('any-exercise-id')
        .withIndex(4)
        .withDuration(20)
        .withWeight(5)
        .build();

      const dto = mapper.toDto(set);

      expect(dto).toMatchObject({
        sessionId: set.sessionId,
        exerciseId: set.exerciseId,
        id: set.id,
        duration: set.duration,
        type: 'iso',
        weight: set.weight,
      });
    });


    test('should include id in DTO if present in domain model', () => {
      const set = new BodyweightSetBuilder()
        .withId(createNanoId())
        .withSessionId('any-session-id')
        .withExerciseId('any-exercise-id')
        .withIndex(4)
        .withReps(25)
        .build();

      const dto = mapper.toDto(set);

      expect(dto.id).toBe(set.id);
    });

    test('should omit id from DTO if not present in domain model', () => {
      const set = new BodyweightSetBuilder()
        .withSessionId('any-session-id')
        .withExerciseId('any-exercise-id')
        .withIndex(4)
        .withReps(25)
        .build();

      const dto = mapper.toDto(set);

      expect(dto.id).toBeUndefined();
    });

    test('should throw error for unsupported set types', () => {
      class UnsupportedSet extends ExerciseSet {
        constructor(sessionId: string, exerciseId: string, index: number) {
          super(sessionId, exerciseId, 'unsupported' as ExerciseSetType, index);
        }

        clone(): ExerciseSet {
          throw new Error('Not implemented');
        }

        get quantity(): number {
          return 0;
        }

        isEqual(other: ExerciseSet): boolean {
          return false;
        }

        print(): string {
          return '';
        }
      }
      const unsupportedSet = new UnsupportedSet('any-session-id', 'any-exercise-id', 1);

      expect(() => mapper.toDto(unsupportedSet)).toThrow(
        `Unsupported exercise set type: ${UnsupportedSet.name}`,
      );
    });
  });
});
