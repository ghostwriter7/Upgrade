import { Service } from '@angular/core';
import { GenericRepository } from '@persistence/repository/generic.repository';
import { NewExercise } from '@domain/model/exercise.model';

@Service()
export class DrillRepository extends GenericRepository {
  constructor() {
    super();
  }

  public save(drill: NewExercise): Promise<void> {
    return this.database.execute(`insert into exercise (id, name) values (:id, :name)`, {
      id: drill.id,
      name: drill.name,
    });
  }
}
