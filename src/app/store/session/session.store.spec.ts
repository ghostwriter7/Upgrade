import { beforeEach, describe, expect, it, Mocked } from 'vitest';
import { SessionStore } from './session.store';
import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '../../persistence/repository/session.repository';
import { DateHelper } from '../../common/helper/date.helper';

describe('SessionStore', () => {
  let sessionStore: InstanceType<typeof SessionStore>;

  const sessionRepositoryMock: Mocked<Pick<SessionRepository, 'findAllByDate' | 'getCountsByMonthAndYear' | 'save' | 'delete'>> = {
    getCountsByMonthAndYear: vi.fn(),
    findAllByDate: vi.fn(),
    save: vi.fn(),
    delete: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionRepository, useValue: sessionRepositoryMock }
      ]
    });
    sessionStore = TestBed.inject(SessionStore);
  });

  const flushEffectsAndPromises = async  () => {
    TestBed.tick();
    await Promise.resolve();
  }

  describe('Initialization', () => {
    it('should fetch sessions for the current date (today) initially', async () => {
      const now = DateHelper.toLocal(DateHelper.now()).withPlainTime('00:00');
      sessionRepositoryMock.findAllByDate.mockResolvedValue([]);

      await flushEffectsAndPromises();

      expect(sessionRepositoryMock.findAllByDate).toHaveBeenCalledExactlyOnceWith(now);
      expect(sessionStore.activeSessions()).toEqual([]);
    });

    it.skip('should fetch sessions for the target date from the repository when not available in the cache', () => {

    });

    it.skip('should early return sessions from the cache when available', () => {

    });
  });
});
