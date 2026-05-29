import { describe, expect, test } from 'vitest';
import { ExerciseLogMapper } from './exercise-log.mapper';
import { ExerciseLog } from '../../../domain/model/session.model';
import { ExerciseLogDto } from '../../schema/exercise-log.schema';

describe('ExerciseSetMapper', () => {
  const mapper = ExerciseLogMapper.INSTANCE;

  describe('toDomain', () => {
    test('should map an exercise entry DTO to ExerciseLog', () => {
      const dto: ExerciseLogDto = {
        exerciseId: 'any-exercise-id',
        sessionId: 'any-session-id',
        id: 'any-id',
        notes: 'any notes',
        mediaIds: [],
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(ExerciseLog);
      expect(domain).toMatchObject({
        exerciseId: dto.exerciseId,
        sessionId: dto.sessionId,
        id: dto.id,
        notes: dto.notes,
        mediaIds: dto.mediaIds,
      });
    });
  });

  describe('toDto', () => {
    test('should map ExerciseLog to an exercise entry DTO', () => {
      const log = new ExerciseLog('sessionId', 'any-exercise-id').withNotes('any notes');

      const dto = mapper.toDto(log);

      expect(dto).toMatchObject({
        id: log.id,
        exerciseId: log.exerciseId,
        sessionId: log.sessionId,
        notes: log.notes,
        mediaIds: log.mediaIds,
      });
    });
  });
});
