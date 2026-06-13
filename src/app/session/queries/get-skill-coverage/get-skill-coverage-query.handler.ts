import { inject, Service } from '@angular/core';
import { QueryHandler, QueryResult } from '@common/routers/query/query-handler.interface';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';
import { Constructor } from '@common/types/constructor.type';
import { SessionRepository } from '@persistence/repository/session.repository';
import { ExerciseStore } from '@store/exercises.store';
import { SkillTag } from '@domain/enum/skill-tag.enum';
import { SkillCoverageBySkill } from '@session/queries/get-skill-coverage/skill-coverage.type';
import { DateHelper } from '@common/helper/date.helper';
import { Session } from '@domain/model/session/session.model';

@Service({ autoProvided: false })
export class GetSkillCoverageQueryHandler implements QueryHandler<GetSkillCoverageQuery> {
  private readonly sessionRepository = inject(SessionRepository);
  private readonly exerciseStore = inject(ExerciseStore);

  public appliesTo(): Constructor<GetSkillCoverageQuery> {
    return GetSkillCoverageQuery;
  }

  public async query({
    lastDays,
    endDate,
  }: GetSkillCoverageQuery): Promise<QueryResult<GetSkillCoverageQuery>> {
    const startDate = DateHelper.toLocal(endDate).subtract({ days: lastDays }).toInstant();

    const sessions = await this.sessionRepository.getSessionsForRange(startDate, endDate);

    return this.computeSkillCoverageBySkill(sessions);
  }

  private getEmptyResult(): SkillCoverageBySkill {
    return Object.values(SkillTag).reduce((result, skillTag) => {
      result[skillTag] = {
        count: 0,
      };

      return result;
    }, {} as SkillCoverageBySkill);
  }

  private computeSkillCoverageBySkill(sessions: Session[]): SkillCoverageBySkill {
    const skillsByExerciseId = this.exerciseStore.skillsByExerciseId();

    return sessions.reduce((skillCoverage, session) => {
      const { exerciseIds } = session;

      for (const id of exerciseIds) {
        const skills = skillsByExerciseId.get(id);

        if (skills) {
          for (const skill of skills) {
            const target = skillCoverage[skill];
            target.count++;
            if (
              !target.lastDate ||
              target.lastDate.epochMilliseconds < session.startedAt.epochMilliseconds
            ) {
              target.lastDate = session.startedAt;
            }
          }
        }
      }

      return skillCoverage;
    }, this.getEmptyResult());  }
}
