import { describe, expect, test } from 'vitest';
import { ExerciseLogMapper } from './exercise-log.mapper';
import { ExerciseLogDto } from '../../schema/exercise-log.schema';
import { ExerciseLog } from '@domain/model/exercise-log.model';

describe('ExerciseSetMapper', () => {
  const mapper = ExerciseLogMapper.INSTANCE;

  describe('toDomain', () => {
    test('should map an exercise entry DTO to ExerciseLog', () => {
      const dto: ExerciseLogDto = {
        exerciseId: 'any-exercise-id',
        sessionId: 'any-session-id',
        id: 'any-id',
        notes: 'any notes',
        index: 1,
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(ExerciseLog);
      expect(domain).toMatchObject({
        exerciseId: dto.exerciseId,
        sessionId: dto.sessionId,
        id: dto.id,
        notes: dto.notes,
        index: dto.index,
      });
    });
  });

  describe('toDto', () => {
    test('should map ExerciseLog to an exercise entry DTO', () => {
      const log = new ExerciseLog('sessionId', 'any-exercise-id')
        .withNotes('any notes')
        .withIndex(5);

      const dto = mapper.toDto(log);

      expect(dto).toMatchObject({
        id: log.id,
        exerciseId: log.exerciseId,
        sessionId: log.sessionId,
        notes: log.notes,
        index: log.index,
      });
    });
  });
});
