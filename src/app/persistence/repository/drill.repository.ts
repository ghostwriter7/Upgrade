import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { NewExercise } from '@domain/model/exercise.model';

@Service()
export class DrillRepository extends GenericRepository {
  constructor() {
    super();
  }

  public save(drill: NewExercise): Promise<void> {
    return this.database.execute(
      `insert into exercise (id, name, units_of_measurement) values (:id, :name, :unitsOfMeasurement)`,
      {
        id: drill.id,
        name: drill.name,
        unitsOfMeasurement: drill.unitsOfMeasurement
          ? JSON.stringify(drill.unitsOfMeasurement)
          : null,
      },
    );
  }
}
