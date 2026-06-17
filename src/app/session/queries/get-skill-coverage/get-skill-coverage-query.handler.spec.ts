import { TestBed } from '@angular/core/testing';
import { GetSkillCoverageQueryHandler } from '@session/queries/get-skill-coverage/get-skill-coverage-query.handler';
import { SessionRepository } from '@persistence/repository/session.repository';
import { ExerciseStore } from '@store/exercises.store';
import { Mock } from 'vitest';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';
import { DateHelper } from '@common/helper/date.helper';
import { SkillTag } from '@domain/enum/skill-tag.enum';
import { Session } from '@domain/model/session/session.model';

describe('GetSkillCoverageQueryHandler', () => {
  let sessionRepositoryMock: { getSessionsForRange: Mock };
  let exerciseStoreMock: { skillsByExerciseId: Mock };
  let handler: GetSkillCoverageQueryHandler;

  beforeEach(() => {
    sessionRepositoryMock = { getSessionsForRange: vi.fn() };
    exerciseStoreMock = { skillsByExerciseId: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock },
        { provide: ExerciseStore, useValue: exerciseStoreMock },
        GetSkillCoverageQueryHandler,
      ],
    });

    handler = TestBed.inject(GetSkillCoverageQueryHandler);
  });

  it('should return the query type it can handle', () =>
    expect(handler.appliesTo()).toEqual(GetSkillCoverageQuery));

  const now = DateHelper.now();
  const start30DaysAgo = DateHelper.toLocal(now).subtract({ days: 30 }).toInstant();

  const assertRepositoryQuery = () =>
    expect(sessionRepositoryMock.getSessionsForRange).toHaveBeenCalledExactlyOnceWith(
      start30DaysAgo,
      now,
    );

  it('should return an empty skill coverage result when there are no sessions', async () => {
    const query = new GetSkillCoverageQuery(now, 30);
    sessionRepositoryMock.getSessionsForRange.mockResolvedValue([]);

    const result = await handler.query(query);

    expect(result).toEqual(
      expect.objectContaining({
        [SkillTag.Bridge]: {
          count: 0,
        },
        [SkillTag.FrontSplit]: {
          count: 0,
        },
      }),
    );
    assertRepositoryQuery();
    expect(exerciseStoreMock.skillsByExerciseId).not.toHaveBeenCalled();
  });

  const session = (at: Temporal.Instant, ...exerciseIds: string[]) => {
    const { session } = Session.createEmpty().addExerciseLogs(exerciseIds);
    session.startedAt = at;
    return session;
  };

  const nowLocal = DateHelper.toLocal(now);
  const yesterday = nowLocal.subtract({ days: 1 }).toInstant();
  const twoDaysAgo = nowLocal.subtract({ days: 2 }).toInstant();
  const weekAgo = nowLocal.subtract({ days: 7 }).toInstant();

  it('should aggregate the session exercises by skill', async () => {
    const query = new GetSkillCoverageQuery(now, 30);
    sessionRepositoryMock.getSessionsForRange.mockResolvedValue([
      session(yesterday, 'chin-ups', 'bridge'),
      session(twoDaysAgo, 'chin-ups', 'side-split'),
      session(weekAgo, 'front-split', 'side-split'),
      session(yesterday, 'exercise-with-no-skill', 'another-exercise-with-no-skill'),
    ]);
    exerciseStoreMock.skillsByExerciseId.mockReturnValue(
      new Map([
        ['chin-ups', [SkillTag.OneArmChinUp]],
        ['bridge', [SkillTag.Bridge]],
        ['front-split', [SkillTag.FrontSplit, SkillTag.Pike]],
        ['side-split', [SkillTag.SideSplit, SkillTag.Pancake]],
      ]),
    );

    const result = await handler.query(query);

    expect(result).toEqual({
      [SkillTag.Bridge]: { count: 1, lastDate: yesterday },
      [SkillTag.Dance]: { count: 0 },
      [SkillTag.Pancake]: { count: 2, lastDate: twoDaysAgo },
      [SkillTag.SideSplit]: { count: 2, lastDate: twoDaysAgo },
      [SkillTag.FrontSplit]: { count: 1, lastDate: weekAgo },
      [SkillTag.OneArmChinUp]: { count: 2, lastDate: yesterday },
      [SkillTag.Handstand]: { count: 0 },
      [SkillTag.Pike]: { count: 1, lastDate: weekAgo },
      [SkillTag.ShoulderMobility]: { count: 0 },
    });
    assertRepositoryQuery();
    expect(exerciseStoreMock.skillsByExerciseId).toHaveBeenCalledOnce();
  });
});
