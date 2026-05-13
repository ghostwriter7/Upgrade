import { beforeEach, describe, expect, it, Mocked } from 'vitest';
import { SessionStore } from './session.store';
import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '../../persistence/repository/session.repository';
import { DateHelper } from '../../common/helper/date.helper';
import { Session } from '../../domain/model/session.model';

describe('SessionStore', () => {
  let sessionStore: InstanceType<typeof SessionStore>;

  const sessionRepositoryMock: Mocked<
    Pick<SessionRepository, 'findAllByDate' | 'getCountsByMonthAndYear' | 'save' | 'delete'>
  > = {
    getCountsByMonthAndYear: vi.fn(),
    findAllByDate: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: SessionRepository, useValue: sessionRepositoryMock }],
    });
    sessionStore = TestBed.inject(SessionStore);
  });

  const flushEffectsAndPromises = async () => {
    TestBed.tick();
    await Promise.resolve();
  };

  describe('Initialization', () => {
    const now = DateHelper.toLocal(DateHelper.now()).withPlainTime('00:00');

    it('should fetch sessions for the current date (today) initially', async () => {
      sessionRepositoryMock.findAllByDate.mockResolvedValue([]);

      await flushEffectsAndPromises();

      expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(now);
      expect(sessionStore.activeSessions()).toEqual([]);
    });

    const yesterday = now.subtract({ days: 1 });
    it('should fetch sessions for the target date from the repository when not available in the cache', async () => {
      sessionRepositoryMock.findAllByDate.mockResolvedValue([]);
      sessionStore.setActiveDate(yesterday.toString());

      await flushEffectsAndPromises();

      expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(yesterday);
      expect(sessionStore.activeSessions()).toEqual([]);
    });

    it('should early return sessions from the cache when available', async () => {
      const todaySessions = [Session.createEmpty()];
      const yesterdaySessions: Session[] = [];

      sessionRepositoryMock.findAllByDate
        .mockResolvedValueOnce(todaySessions)
        .mockResolvedValueOnce(yesterdaySessions);

      await flushEffectsAndPromises(); // Fetch today's data

      expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(now);
      expect(sessionStore.activeSessions()).toEqual(todaySessions);

      sessionStore.setActiveDate(yesterday.toPlainDate().toString());

      await flushEffectsAndPromises(); // Fetch yesterday's data

      expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledTimes(2);

      sessionRepositoryMock.findAllByDate.mockClear();

      sessionStore.setActiveDate(now.toPlainDate().toString());

      TestBed.tick(); // Trigger effect

      expect(sessionRepositoryMock.findAllByDate).not.toHaveBeenCalled();
      expect(sessionStore.activeSessions()).toEqual(todaySessions);
    });
  });
});
