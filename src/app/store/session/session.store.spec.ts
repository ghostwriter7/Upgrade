import { beforeEach, describe, expect, it, Mock, Mocked } from 'vitest';
import { SessionStore } from './session.store';
import { TestBed } from '@angular/core/testing';
import { SessionRepository } from '@persistence/repository/session.repository';
import { DateHelper } from '@common/helper/date.helper';
import { Session } from '@domain/model/session/session.model';
import { QueryBus } from '@common/routers/query/query-bus';
import { FindSessionsByDateQuery } from '@session/queries/find-sessions-by-date/find-sessions-by-date.query';

type SessionRepositoryMock = Mocked<Pick<SessionRepository, 'getSessionsByMonthAndYear' | 'save'>>;

const createSessionAt = (iso: string): Session => {
  const session = Session.createEmpty();
  session.startedAt = Temporal.Instant.from(iso);
  return session;
};

const createSessionFixture = () => {
  const sessionOne = createSessionAt('2023-08-01T00:00:00Z');

  const sessionTwo = Session.createEmpty();
  sessionTwo.startedAt = sessionOne.startedAt;

  const sessionThree = Session.createEmpty();
  sessionThree.startedAt = DateHelper.toLocal(sessionOne.startedAt)
    .add(Temporal.Duration.from('+P2D'))
    .toInstant();

  const { year, month } = DateHelper.toLocal(sessionOne.startedAt);
  const yearMonthId = `${year}-${month}`;

  return {
    sessionOne,
    sessionTwo,
    sessionThree,
    yearMonthId,
  };
};

describe('SessionStore', () => {
  let store: InstanceType<typeof SessionStore>;

  const expectSessionsByDate = (expected: Record<string, Session[]>) =>
    expect(store.sessionsByDate()).toEqual(expected);

  const expectCountsByMonthAndYear = (expected: Record<string, Record<number, number>>) =>
    expect(store.countsByMonthAndYear()).toEqual(expected);

  const sessionRepositoryMockFactory = () => ({
    getCountsByMonthAndYear: vi.fn(),
    save: vi.fn(),
  });

  let sessionRepositoryMock: SessionRepositoryMock;
  let queryBus: { execute: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    queryBus = { execute: vi.fn() };

    sessionRepositoryMock = sessionRepositoryMockFactory();
    TestBed.configureTestingModule({
      providers: [
        { provide: QueryBus, useValue: queryBus },
        { provide: SessionRepository, useValue: sessionRepositoryMock },
      ],
    });
    store = TestBed.inject(SessionStore);
  });

  const flushEffectsAndPromises = async () => {
    TestBed.tick();
    await Promise.resolve();
  };

  const now = DateHelper.toLocal(DateHelper.now()).withPlainTime('00:00');
  const nowStr = now.toPlainDate().toString();

  describe('Initialization', () => {
    const yesterday = now.subtract({ days: 1 });
    const yesterdayStr = yesterday.toPlainDate().toString();

    it('should fetch sessions for the current date (today) initially', async () => {
      queryBus.execute.mockResolvedValueOnce([]);

      await flushEffectsAndPromises();

      expect(queryBus.execute).toHaveBeenCalledExactlyOnceWith(new FindSessionsByDateQuery(now));
      expect(store.activeSessions()).toEqual([]);
    });

    it('should fetch sessions for the target date from the repository when not available in the cache', async () => {
      queryBus.execute.mockResolvedValueOnce([]);
      store.setActiveDate(yesterdayStr);

      await flushEffectsAndPromises();

      expect(queryBus.execute).toHaveBeenCalledExactlyOnceWith(
        new FindSessionsByDateQuery(yesterday),
      );
      expect(store.activeSessions()).toEqual([]);
    });

    it('should early return sessions from the cache when available', async () => {
      const todaySessions = [Session.createEmpty()];
      const yesterdaySessions: Session[] = [];

      queryBus.execute
        .mockResolvedValueOnce(todaySessions)
        .mockResolvedValueOnce(yesterdaySessions);

      await flushEffectsAndPromises(); // Fetch today's data

      expect(queryBus.execute).toHaveBeenCalledExactlyOnceWith(new FindSessionsByDateQuery(now));
      expect(store.activeSessions()).toEqual(todaySessions);

      store.setActiveDate(yesterdayStr);

      await flushEffectsAndPromises(); // Fetch yesterday's data

      expect(queryBus.execute).toHaveBeenCalledTimes(2);

      queryBus.execute.mockClear();

      store.setActiveDate(nowStr);

      TestBed.tick(); // Trigger effect

      expect(queryBus.execute).not.toHaveBeenCalled();
      expect(store.activeSessions()).toEqual(todaySessions);
    });
  });

  describe('Counts by a month and a year', () => {
    beforeEach(async () => {
      queryBus.execute.mockResolvedValueOnce([]);
      await flushEffectsAndPromises();
    });

    const savedCounts = { 1: 1, 3: 1 };
    it('should fetch counts from the repository when there is no cached entry', async () => {
      sessionRepositoryMock.getSessionsByMonthAndYear.mockResolvedValueOnce(savedCounts);

      const counts = await store.getCountsByMonthAndYear(7, 2026);

      expect(counts).toEqual(savedCounts);
      expect(sessionRepositoryMock.getSessionsByMonthAndYear).toHaveBeenCalledExactlyOnceWith(
        7,
        2026,
      );
    });

    it('should return counts from the cache when it is available', async () => {
      sessionRepositoryMock.getSessionsByMonthAndYear.mockResolvedValueOnce(savedCounts);
      await store.getCountsByMonthAndYear(7, 2026);

      const counts = await store.getCountsByMonthAndYear(7, 2026);

      expect(counts).toEqual(savedCounts);
      expect(sessionRepositoryMock.getSessionsByMonthAndYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Save a session', () => {
    it('should save a new session and increment a counter', () => {
      const { sessionOne, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);

      expectSessionsByDate({ [sessionOne.isoDate]: [sessionOne] });
      expectCountsByMonthAndYear({ [yearMonthId]: { [sessionOne.dayOfMonth]: 1 } });
    });

    it('should properly save a new session when an existing session for the same day exists', () => {
      const { sessionOne, sessionTwo, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);
      sessionRepositoryMock.save.mockClear();

      store.updateCache(sessionTwo);

      expectSessionsByDate({ [sessionTwo.isoDate]: [sessionOne, sessionTwo] });
      expectCountsByMonthAndYear({ [yearMonthId]: { [sessionTwo.dayOfMonth]: 2 } });
    });

    it('should properly save a new session when another session exists in the cache for another day', () => {
      const { sessionOne, sessionThree, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);
      sessionRepositoryMock.save.mockClear();

      store.updateCache(sessionThree);

      expectSessionsByDate({
        [sessionOne.isoDate]: [sessionOne],
        [sessionThree.isoDate]: [sessionThree],
      });
      expectCountsByMonthAndYear({
        [yearMonthId]: {
          [sessionOne.dayOfMonth]: 1,
          [sessionThree.dayOfMonth]: 1,
        },
      });
    });

    it('should update a session instead of inserting a duplicate', () => {
      const { sessionOne, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);
      sessionRepositoryMock.save.mockClear();
      const updatedSession = sessionOne.addExerciseLog('anyExerciseId').session;

      store.updateCache(updatedSession);

      expectSessionsByDate({ [updatedSession.isoDate]: [updatedSession] });
      expectCountsByMonthAndYear({ [yearMonthId]: { [updatedSession.dayOfMonth]: 1 } });
    });
  });

  describe('Delete a session', () => {
    it('should delete a session and decrement a counter when no other sessions exist for the same day', () => {
      const { sessionOne, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);

      store.delete(sessionOne);

      expectSessionsByDate({ [sessionOne.isoDate]: [] });
      expectCountsByMonthAndYear({ [yearMonthId]: { [sessionOne.dayOfMonth]: 0 } });
    });

    it('should delete a session when another session exists for the same day', () => {
      const { sessionOne, sessionTwo, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);
      store.updateCache(sessionTwo);

      store.delete(sessionOne);

      expectSessionsByDate({ [sessionTwo.isoDate]: [sessionTwo] });
      expectCountsByMonthAndYear({ [yearMonthId]: { [sessionTwo.dayOfMonth]: 1 } });
    });

    it('should delete a session when another session exists in the cache (different day)', () => {
      const { sessionOne, sessionThree, yearMonthId } = createSessionFixture();
      store.updateCache(sessionOne);
      store.updateCache(sessionThree);

      store.delete(sessionOne);

      expectSessionsByDate({ [sessionOne.isoDate]: [], [sessionThree.isoDate]: [sessionThree] });
      expectCountsByMonthAndYear({
        [yearMonthId]: { [sessionOne.dayOfMonth]: 0, [sessionThree.dayOfMonth]: 1 },
      });
    });
  });
});
