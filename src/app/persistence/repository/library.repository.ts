import { Service } from '@angular/core';
import { Repository } from '@persistence/repository/repository';
import { UpsertExercisePayload } from '@domain/model/exercise.model';
import {
  ExerciseDto,
  ExerciseSchema,
} from '@persistence/schema/skill.schema';

const toPayload = (exercise: UpsertExercisePayload) => ({
  id: exercise.id,
  name: exercise.name,
  unitsOfMeasurement: exercise.unitsOfMeasurement
    ? JSON.stringify(exercise.unitsOfMeasurement)
    : null,
  isFavourite: exercise.isFavourite,
  status: exercise.status,
  type: exercise.type,
});

@Service()
export class LibraryRepository extends Repository {
  constructor() {
    super();
  }

  public async getAllExercises(): Promise<ExerciseDto[]> {
    const results = await this.database.queryMany(`select e.id,
                                                          e.name,
                                                          e.units_of_measurement as unitsOfMeasurement,
                                                          e.is_favourite         as isFavourite,
                                                          e.status               as status,
                                                          e.type                 as type,
                                                          max(el.created_at)     as lastPerformedAt
                                                   from exercise e
                                                            left join exercise_log el on e.id = el.exercise_id
                                                   group by e.id, e.name, e.units_of_measurement, e.is_favourite, e.status
    `);
    return results.map((r) => ExerciseSchema.parse(r));
  }

  public saveExercise(exercise: UpsertExercisePayload): Promise<void> {
    return this.database.execute(
      `insert into exercise (id, name, units_of_measurement, is_favourite, type) values (:id, :name, :unitsOfMeasurement, :isFavourite, :type)`,
      toPayload(exercise),
    );
  }

  public updateExercise(exercise: UpsertExercisePayload): Promise<void> {
    return this.database.execute(
      `update exercise set name = :name, units_of_measurement = :unitsOfMeasurement, is_favourite = :isFavourite, status = :status, type = :type where id = :id`,
      toPayload(exercise),
    );
  }

  public deleteExerciseById(id: string): Promise<void> {
    return this.database.execute('delete from exercise where id = :id', { id });
  }
}
