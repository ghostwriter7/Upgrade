import { Injectable } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import {
  AngleMeasurementDto,
  AngleMeasurementSchema,
} from '@persistence/schema/angle-measurement.schema';
import { AngleMeasurement } from '@domain/model/measurement.model';
import { StoreName } from '@persistence/repository/store-name.enum';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';
import { IndexName } from '@persistence/repository/index-name.enum';

@Injectable({ providedIn: 'root' })
export class AngleMeasurementRepository extends GenericRepository<AngleMeasurementDto> {
  public saveMeasurement(measurement: AngleMeasurement): Promise<IDBValidKey> {
    return this.put(
      StoreName.ANGLE_MEASUREMENTS,
      AngleMeasurementMapper.INSTANCE.toDto(measurement),
    );
  }

  public deleteAllByExerciseLogId(exerciseLogId: string): Promise<void> {
    return super.deleteAllByIndex(
      StoreName.ANGLE_MEASUREMENTS,
      IndexName.AngleMeasurementsByExerciseLogId,
      exerciseLogId,
    );
  }

  public async findAllByExerciseLogId(exerciseLogId: string): Promise<AngleMeasurement[]> {
    const measurements = await super.findAllBy(
      StoreName.ANGLE_MEASUREMENTS,
      (store: IDBObjectStore) =>
        store.index(IndexName.AngleMeasurementsByExerciseLogId).getAll(exerciseLogId),
    );
    return Iterator.from(measurements)
      .map((entry) => AngleMeasurementSchema.parse(entry))
      .map(AngleMeasurementMapper.INSTANCE.toDomain)
      .toArray();
  }

  public async getAllMeasurements(): Promise<AngleMeasurement[]> {
    const measurements = await super.findAll(StoreName.ANGLE_MEASUREMENTS);
    return measurements.map(AngleMeasurementMapper.INSTANCE.toDomain);
  }

  public deleteAllMeasurements(): Promise<void> {
    return super.deleteAll(StoreName.ANGLE_MEASUREMENTS);
  }
}
