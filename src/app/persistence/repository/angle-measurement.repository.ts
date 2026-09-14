import { Injectable } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { AngleMeasurementSchema } from '@persistence/schema/angle-measurement.schema';
import { AngleMeasurement } from '@domain/model/measurement.model';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';

@Injectable({ providedIn: 'root' })
export class AngleMeasurementRepository extends GenericRepository {
  public save(measurement: AngleMeasurement): Promise<void> {
    return super.execute(
      `
      insert into angle_measurement (media_id, exercise_log_id, angle, landmarks)
      values (:mediaId, :exerciseLogId, :angle, :landmarks)
    `,
      {
        mediaId: measurement.mediaId,
        exerciseLogId: measurement.exerciseLogId,
        angle: measurement.angle,
        landmarks: JSON.stringify(measurement.landmarks),
      },
    );
  }

  public async findAllByExerciseLogId(exerciseLogId: string): Promise<AngleMeasurement[]> {
    const results = await super.queryMany(
      `
    select id, media_id as mediaId, exercise_log_id as exerciseLogId, angle, landmarks
    from angle_measurement where exercise_log_id = :exerciseLogId
    `,
      { exerciseLogId },
    );
    return this.toDomain(results);
  }

  private toDomain(results: unknown[]): AngleMeasurement[] {
    return Iterator.from(results)
      .map((entry) => AngleMeasurementSchema.parse(entry))
      .map(AngleMeasurementMapper.INSTANCE.toDomain)
      .toArray();
  }
}
