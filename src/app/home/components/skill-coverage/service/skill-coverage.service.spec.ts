import { SkillCoverageService } from '@home/components/skill-coverage/service/skill-coverage.service';
import { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { QueryBus } from '@common/routers/query/query-bus';
import { Skills, SkillTag } from '@domain/enum/skill-tag.enum';
import { DateHelper } from '@common/helper/date.helper';
import { GetSkillCoverageQuery } from '@session/queries/get-skill-coverage/get-skill-coverage.query';

describe('SkillCoverageService', () => {
  let service: SkillCoverageService;
  let queryBusMock: { execute: Mock };
  const now = DateHelper.now();

  beforeEach(() => {
    queryBusMock = { execute: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: QueryBus, useValue: queryBusMock }, SkillCoverageService],
    });

    service = TestBed.inject(SkillCoverageService);

    vi.spyOn(DateHelper, 'now').mockReturnValue(now);
  });

  const nowLocal = DateHelper.toLocal(now);
  const yesterday = nowLocal.subtract({ days: 1 }).toInstant();
  const twoDaysAgo = nowLocal.subtract({ days: 2 }).toInstant();
  const weekAgo = nowLocal.subtract({ days: 7 }).toInstant();

  const record = (skill: Skills, count: number, daysAgo: number, lastDate?: Temporal.Instant) => ({
    skill,
    count,
    daysAgo,
    lastDate,
  });

  const queryResult = {
    [SkillTag.Bridge]: { count: 5, lastDate: yesterday },
    [SkillTag.Pancake]: { count: 5, lastDate: twoDaysAgo },
    [SkillTag.SideSplit]: { count: 3, lastDate: twoDaysAgo },
    [SkillTag.FrontSplit]: { count: 2, lastDate: weekAgo },
    [SkillTag.OneArmChinUp]: { count: 2, lastDate: yesterday },
    [SkillTag.Handstand]: { count: 0 },
    [SkillTag.Pike]: { count: 1, lastDate: weekAgo },
    [SkillTag.ShoulderMobility]: { count: 0 },
  };

  const bridge = record(SkillTag.Bridge, 5, 1, yesterday);
  const pancake = record(SkillTag.Pancake, 5, 2, twoDaysAgo);
  const sideSplit = record(SkillTag.SideSplit, 3, 2, twoDaysAgo);
  const oneArmChinUp = record(SkillTag.OneArmChinUp, 2, 1, yesterday);
  const frontSplit = record(SkillTag.FrontSplit, 2, 7, weekAgo);
  const pike = record(SkillTag.Pike, 1, 7, weekAgo);
  const handstand = record(SkillTag.Handstand, 0, -1);
  const shoulderMobility = record(SkillTag.ShoulderMobility, 0, -1);

  describe('Sort By', () => {
    beforeEach(async () => {
      queryBusMock.execute.mockResolvedValue(queryResult);
      await service.computeCoverage(30);
    });

    const ASC = 'asc' as const;
    const DESC = 'desc' as const;

    test.each([
      {
        active: 'count',
        direction: ASC,
        expected: [
          handstand,
          shoulderMobility,
          pike,
          frontSplit,
          oneArmChinUp,
          sideSplit,
          bridge,
          pancake,
        ],
      },
      {
        active: 'count',
        direction: DESC,
        expected: [
          bridge,
          pancake,
          sideSplit,
          frontSplit,
          oneArmChinUp,
          pike,
          handstand,
          shoulderMobility,
        ],
      },
      {
        active: 'daysAgo',
        direction: ASC,
        expected: [
          handstand,
          shoulderMobility,
          bridge,
          oneArmChinUp,
          pancake,
          sideSplit,
          frontSplit,
          pike,
        ],
      },
      {
        active: 'daysAgo',
        direction: DESC,
        expected: [
          frontSplit,
          pike,
          pancake,
          sideSplit,
          bridge,
          oneArmChinUp,
          handstand,
          shoulderMobility,
        ],
      },
      {
        active: 'skill',
        direction: ASC,
        expected: [
          bridge,
          frontSplit,
          handstand,
          oneArmChinUp,
          pancake,
          pike,
          shoulderMobility,
          sideSplit,
        ],
      },
      {
        active: 'skill',
        direction: DESC,
        expected: [
          sideSplit,
          shoulderMobility,
          pike,
          pancake,
          oneArmChinUp,
          handstand,
          frontSplit,
          bridge,
        ],
      },
    ])('should sort by "$active" and direction: $direction', ({ active, direction, expected }) => {
      service.sortBy({ active, direction });

      const result = service.$skillCoverage();

      expect(result).toEqual(expected);
    });
  });

  it('should fetch and post-process skill coverage records', async () => {
    queryBusMock.execute.mockResolvedValue(queryResult);

    await service.computeCoverage(30);
    const records = service.$skillCoverage();

    expect(queryBusMock.execute).toHaveBeenCalledExactlyOnceWith(
      new GetSkillCoverageQuery(now, 30),
    );
    expect(records).toEqual([
      bridge,
      pancake,
      sideSplit,
      oneArmChinUp,
      frontSplit,
      pike,
      handstand,
      shoulderMobility,
    ]);
  });
});
