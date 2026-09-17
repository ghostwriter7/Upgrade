import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { UpsertExercisePayload } from '@domain/model/exercise.model';

const toPayload = (drill: UpsertExercisePayload) => ({
  id: drill.id,
  name: drill.name,
  unitsOfMeasurement: drill.unitsOfMeasurement ? JSON.stringify(drill.unitsOfMeasurement) : null,
  isFavourite: drill.isFavourite,
});

@Service()
export class DrillRepository extends GenericRepository {
  constructor() {
    super();
  }

  public save(drill: UpsertExercisePayload): Promise<void> {
    return this.database.execute(
      `insert into exercise (id, name, units_of_measurement, is_favourite) values (:id, :name, :unitsOfMeasurement, :isFavourite)`,
      toPayload(drill),
    );
  }

  public update(drill: UpsertExercisePayload): Promise<void> {
    return this.database.execute(
      `update exercise set name = :name, units_of_measurement = :unitsOfMeasurement, is_favourite = :isFavourite where id = :id`,
      toPayload(drill),
    );
  }
}
