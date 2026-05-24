import { describe, expect, test } from 'vitest';
import { ExerciseEntryMapper } from './exercise-entry.mapper';
import { ExerciseEntryDto } from '../../schema/session.schema';
import { ExerciseLog } from '../../../domain/model/session.model';

describe('ExerciseSetMapper', () => {
  const mapper = ExerciseEntryMapper.INSTANCE;

  describe('toDomain', () => {
    test('should map an exercise entry DTO to ExerciseLog', () => {
      const dto: ExerciseEntryDto = {
        exerciseId: 'any-exercise-id',
        notes: 'any notes',
        mediaIds: [],
      };

      const domain = mapper.toDomain(dto);

      expect(domain).toBeInstanceOf(ExerciseLog);
      expect(domain).toMatchObject({
        exerciseId: dto.exerciseId,
        notes: dto.notes,
        mediaIds: dto.mediaIds,
      });
    });
  });

  describe('toDto', () => {
    test('should map ExerciseLog to an exercise entry DTO', () => {
      const log = new ExerciseLog('any-exercise-id').withNotes('any notes');

      const dto = mapper.toDto(log);

      expect(dto).toMatchObject({
        exerciseId: log.exerciseId,
        notes: log.notes,
        mediaIds: log.mediaIds,
      });
    });
  });
});
