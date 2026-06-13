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

  it('should fetch and post-process skill coverage records', async () => {
    queryBusMock.execute.mockResolvedValue({
      [SkillTag.Bridge]: { count: 5, lastDate: yesterday },
      [SkillTag.Pancake]: { count: 5, lastDate: twoDaysAgo },
      [SkillTag.SideSplit]: { count: 3, lastDate: twoDaysAgo },
      [SkillTag.FrontSplit]: { count: 2, lastDate: weekAgo },
      [SkillTag.OneArmChinUp]: { count: 2, lastDate: yesterday },
      [SkillTag.Handstand]: { count: 0 },
      [SkillTag.Pike]: { count: 1, lastDate: weekAgo },
      [SkillTag.ShoulderMobility]: { count: 0 },
    });

    const records = await service.fetchCoverage(30);

    expect(queryBusMock.execute).toHaveBeenCalledExactlyOnceWith(
      new GetSkillCoverageQuery(now, 30),
    );
    expect(records).toEqual([
      record(SkillTag.Bridge, 5, 1, yesterday),
      record(SkillTag.Pancake, 5, 2, twoDaysAgo),
      record(SkillTag.SideSplit, 3, 2, twoDaysAgo),
      record(SkillTag.OneArmChinUp, 2, 1, yesterday),
      record(SkillTag.FrontSplit, 2, 7, weekAgo),
      record(SkillTag.Pike, 1, 7, weekAgo),
      record(SkillTag.Handstand, 0, -1),
      record(SkillTag.ShoulderMobility, 0, -1),
    ]);
  });
});
