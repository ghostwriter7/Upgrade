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

const toPayload = (exercise: UpsertExercisePayload) => ({
  id: exercise.id,
  name: exercise.name,
  unitsOfMeasurement: exercise.unitsOfMeasurement
    ? JSON.stringify(exercise.unitsOfMeasurement)
    : null,
  isFavourite: exercise.isFavourite,
});

@Service()
export class LibraryRepository extends Repository {
  constructor() {
    super();
  }

  public async getAllSkills(): Promise<SkillDto[]> {
    const results = await this.database.queryMany(`select s.id,
                                                          s.name,
                                                          s.is_favourite as isFavourite,
                                                          json_group_array(se.exercise_id)
                                                                           filter (where se.exercise_id is not null) as exerciseIds
                                                   from skill s
                                                          left join skill_exercise se on s.id = se.skill_id
                                                   group by s.id, s.name, s.is_favourite
                                                   order by s.name;
    `);
    return results.map((r) => SkillSchema.parse(r));
  }

  public async getAllExercises(): Promise<ExerciseDto[]> {
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

  public updateSkill(
    skill: Skill,
    removedExerciseIds: Set<string>,
    addedExerciseIds: Set<string>,
  ): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `update skill set name = :name, is_favourite = :isFavourite where id = :id`,
        params: { id: skill.id, name: skill.name, isFavourite: skill.isFavourite },
      },
    ];

    if (removedExerciseIds.size) {
      requests.push({
        sql: `delete from skill_exercise where skill_id = :skillId and exercise_id = :exerciseId`,
        batch: true,
        params: [...removedExerciseIds].map((exerciseId) => ({ skillId: skill.id, exerciseId })),
      });
    }

    if (addedExerciseIds.size) {
      requests.push({
        sql: `insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)`,
        batch: true,
        params: [...addedExerciseIds].map((exerciseId) => ({ skillId: skill.id, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }

  public saveSkill(skill: Skill): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `insert into skill (id, name, is_favourite) values (:id, :name, :isFavourite)`,
        params: { id: skill.id, name: skill.name, isFavourite: skill.isFavourite },
      },
    ];

    if (skill.exerciseIds.length) {
      requests.push({
        sql: `insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)`,
        batch: true,
        params: skill.exerciseIds.map((exerciseId) => ({ skillId: skill.id, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }

  public saveExercise(exercise: UpsertExercisePayload): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `insert into exercise (id, name, units_of_measurement, is_favourite) values (:id, :name, :unitsOfMeasurement, :isFavourite)`,
        params: toPayload(exercise),
      },
    ];

    const skillIds = exercise.skillIds;
    const exerciseId = exercise.id;
    if (skillIds?.length) {
      requests.push({
        sql: 'insert into skill_exercise (skill_id, exercise_id) values (:skillId, :exerciseId)',
        batch: true,
        params: skillIds.map((skillId) => ({ skillId, exerciseId })),
      });
    }

    return this.database.executeMany(requests);
  }

  public updateExercise(
    exercise: UpsertExercisePayload,
    removedSkillIds: string[],
    addedSkillIds: string[],
  ): Promise<void> {
    const requests: ExecuteManyRequestsPayload = [
      {
        sql: `update exercise set name = :name, units_of_measurement = :unitsOfMeasurement, is_favourite = :isFavourite where id = :id`,
        params: toPayload(exercise),
      },
    ];

    const exerciseId = exercise.id;

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

  public deleteSkillById(id: string): Promise<void> {
    return this.database.execute('delete from skill where id = :id', { id });
  }

  public deleteExerciseById(id: string): Promise<void> {
    return this.database.execute('delete from exercise where id = :id', { id });
  }
}
