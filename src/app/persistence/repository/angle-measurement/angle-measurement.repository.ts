import { Injectable } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import {
  AngleMeasurementDto,
  AngleMeasurementSchema,
} from '@persistence/schema/angle-measurement.schema';
import { AngleMeasurement } from '@domain/model/measurement.model';
import { StoreName } from '@persistence/repository/store-name.enum';
import { AngleMeasurementMapper } from '@persistence/mapper/angle-measurement/angle-measurement.mapper';

@Injectable({ providedIn: 'root' })
export class AngleMeasurementRepository extends GenericRepository<AngleMeasurementDto> {
  public saveMeasurement(measurement: AngleMeasurement): Promise<IDBValidKey> {
    return this.put(
      StoreName.ANGLE_MEASUREMENTS,
      AngleMeasurementMapper.INSTANCE.toDto(measurement),
    );
  }

  public async findAllByExerciseLogId(exerciseLogId: string): Promise<AngleMeasurement[]> {
    const measurements = await super.findAllBy(
      StoreName.ANGLE_MEASUREMENTS,
      (store: IDBObjectStore) => store.get(exerciseLogId),
    );
    return Iterator.from(measurements)
      .map((entry) => AngleMeasurementSchema.parse(entry))
      .map(AngleMeasurementMapper.INSTANCE.toDomain)
      .toArray();
  }
}
