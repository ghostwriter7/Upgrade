import { FindMediaAndMeasurementsByExerciseLogIdQueryHandler } from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id-query.handler';
import { TestBed } from '@angular/core/testing';
import { MediaRepository } from '@persistence/repository/media.repository';
import { AngleMeasurementRepository } from '@persistence/repository/angle-measurement.repository';
import { Mock } from 'vitest';
import { AngleMeasurement } from '@domain/model/measurement.model';
import {
  ExerciseMediaWithMeasurements,
  FindMediaAndMeasurementsByExerciseLogIdQuery,
} from '@session/queries/find-media-and-measurements-by-exercise-log-id/find-media-and-measurements-by-exercise-log-id.query';
import { ExerciseMedia, Size } from '@domain/model/exercise-media.model';

describe('FindMediaAndMeasurementsByExerciseLogIdQueryHandler', () => {
  let handler: FindMediaAndMeasurementsByExerciseLogIdQueryHandler;
  let mediaRepositoryMock: { findAllByExerciseLogId: Mock };
  let angleMeasurementRepositoryMock: { findAllByExerciseLogId: Mock };

  beforeEach(() => {
    mediaRepositoryMock = { findAllByExerciseLogId: vi.fn() };
    angleMeasurementRepositoryMock = { findAllByExerciseLogId: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: MediaRepository, useValue: mediaRepositoryMock },
        { provide: AngleMeasurementRepository, useValue: angleMeasurementRepositoryMock },
        FindMediaAndMeasurementsByExerciseLogIdQueryHandler,
      ],
    });

    handler = TestBed.inject(FindMediaAndMeasurementsByExerciseLogIdQueryHandler);
  });

  const measurement = (measurementId: string, mediaId: string) =>
    new AngleMeasurement(measurementId, mediaId, 'exerciseId', 'exerciseLogId', 120, []);

  const media = (mediaId: string) =>
    new ExerciseMedia(mediaId, 'exerciseId', 'exerciseLogId', new Blob(), new Size(100, 100));

  it('should return the query type it can handle', () =>
    expect(handler.appliesTo()).toBe(FindMediaAndMeasurementsByExerciseLogIdQuery));

  const measurementA = measurement('measurementA', 'mediaA');
  const measurementB = measurement('measurementB', 'mediaB');

  const mediaA = media('mediaA');
  const mediaB = media('mediaB');

  test.each([
    {
      measurements: [],
      media: [],
      expected: [],
    },
    {
      measurements: [measurementA, measurementB],
      media: [mediaA, mediaB],
      expected: [
        new ExerciseMediaWithMeasurements(mediaA, measurementA),
        new ExerciseMediaWithMeasurements(mediaB, measurementB),
      ],
    },
    {
      measurements: [measurementB],
      media: [mediaA, mediaB],
      expected: [
        new ExerciseMediaWithMeasurements(mediaA, undefined),
        new ExerciseMediaWithMeasurements(mediaB, measurementB),
      ],
    },
  ])('should execute query', async ({ measurements, media, expected }) => {
    const exerciseLogId = 'exerciseLogId';
    const query = new FindMediaAndMeasurementsByExerciseLogIdQuery(exerciseLogId);
    mediaRepositoryMock.findAllByExerciseLogId.mockResolvedValueOnce(media);
    angleMeasurementRepositoryMock.findAllByExerciseLogId.mockResolvedValueOnce(measurements);

    const result = await handler.query(query);

    expect(result).toEqual(expected);
    expect(mediaRepositoryMock.findAllByExerciseLogId).toHaveBeenCalledExactlyOnceWith(
      exerciseLogId,
    );
    expect(angleMeasurementRepositoryMock.findAllByExerciseLogId).toHaveBeenCalledExactlyOnceWith(
      exerciseLogId,
    );
  });
});
