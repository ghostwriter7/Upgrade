import { Service } from '@angular/core';
import { Repository } from '@persistence/repository/repository';
import { UpsertExercisePayload } from '@domain/model/exercise.model';
import { ExecuteManyRequestsPayload } from '@infrastructure/sql-request.interface';
import {
  ExerciseDto,
  ExerciseSchema,
  SkillDto,
  SkillSchema,
} from '@persistence/schema/skill.schema';
import { Skill } from '@domain/model/skill';

const toPayload = (drill: UpsertExercisePayload) => ({
  id: drill.id,
  name: drill.name,
  unitsOfMeasurement: drill.unitsOfMeasurement ? JSON.stringify(drill.unitsOfMeasurement) : null,
  isFavourite: drill.isFavourite,
});

@Service()
export class LibraryRepository extends Repository {
  constructor() {
    super();
  }

  public async getAllSkills(): Promise<SkillDto[]> {
    const results = await this.database.queryMany(`select id, name from skill`);
    return results.map((r) => SkillSchema.parse(r));
  }

  public async getAllDrills(): Promise<ExerciseDto[]> {
    const results = await this.database.queryMany(`select e.id,
                                                          e.name,
                                                          e.units_of_measurement as unitsOfMeasurement,
                                                          e.is_favourite         as isFavourite,
                                                          max(el.created_at)     as lastPerformedAt,
                                                          (select json_group_array(se.skill_id)
                                                           from skill_exercise se
                                                           where se.exercise_id = e.id
                                                             and se.skill_id is not null
                                                           order by se.skill_id) as skillIds
                                                   from exercise e
                                                            left join exercise_log el on e.id = el.exercise_id
                                                            left join skill_exercise se on e.id = se.exercise_id
                                                   group by e.id, e.name, e.units_of_measurement, e.is_favourite
    `);
    return results.map((r) => ExerciseSchema.parse(r));
  }

  public saveSkill(skill: Skill, exerciseIds: string[]): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `insert into skill (id, name) values (:id, :name)`,
        params: { id: skill.id, name: skill.name },
      },
    ];

    if (exerciseIds.length) {
      requests.push({
        sql: `insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)`,
        batch: true,
        params: exerciseIds.map((exerciseId) => ({ skillId: skill.id, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }

  public saveDrill(drill: UpsertExercisePayload): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `insert into exercise (id, name, units_of_measurement, is_favourite) values (:id, :name, :unitsOfMeasurement, :isFavourite)`,
        params: toPayload(drill),
      },
    ];

    const skillIds = drill.skillIds;
    const exerciseId = drill.id;
    if (skillIds?.length) {
      requests.push({
        sql: 'insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)',
        batch: true,
        params: skillIds.map((skillId) => ({ skillId, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }

  public updateDrill(
    drill: UpsertExercisePayload,
    removedSkillIds: string[],
    addedSkillIds: string[],
  ): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `update exercise set name = :name, units_of_measurement = :unitsOfMeasurement, is_favourite = :isFavourite where id = :id`,
        params: toPayload(drill),
      },
    ];

    const exerciseId = drill.id;

    if (removedSkillIds.length) {
      requests.push({
        sql: 'delete from skill_exercise where skill_id = :skillId and exercise_id = :exerciseId',
        batch: true,
        params: removedSkillIds.map((skillId) => ({ skillId, exerciseId })),
      });
    }

    if (addedSkillIds.length) {
      requests.push({
        sql: 'insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)',
        batch: true,
        params: addedSkillIds.map((skillId) => ({ skillId, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }
}
