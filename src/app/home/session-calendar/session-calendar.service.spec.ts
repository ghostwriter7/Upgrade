import { describe, Mock, test, vi } from 'vitest';
import { SessionCalendarService } from './session-calendar.service';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../store/session/session.store';

async function flushPromises() {
  TestBed.tick();
  await Promise.resolve();
}

describe('SessionCalendarService', () => {
  let service: SessionCalendarService;
  let sessionStore: {
    getCountsByMonthAndYear: Mock;
  };

  beforeEach(() => {
    vi.spyOn(Temporal.Now, 'plainDateISO').mockReturnValue(Temporal.PlainDate.from('2026-05-15'));

    sessionStore = {
      getCountsByMonthAndYear: vi.fn().mockResolvedValue({}),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: SessionStore, useValue: sessionStore }, SessionCalendarService],
    });

    service = TestBed.inject(SessionCalendarService);
  });

  test('should create', () => expect(service).toBeTruthy());

  test('initializes the first day of the current month', () =>
    expect(service.$firstDayOfMonth().toString()).toBe('2026-05-01'));

  test('loads session counts for the initial month', async () => {
    await flushPromises();

    expect(sessionStore.getCountsByMonthAndYear).toHaveBeenCalledWith(5, 2026);
  });

  test('builds calendar cells for the active month', async () => {
    await flushPromises();

    const cells = service.$calendarCells();

    expect(cells.length).toBe(35);
    expect(cells.length % 7).toBe(0);

    expect(cells[0]).toMatchObject({
      day: null,
      date: '2026-04-27',
    });

    expect(cells[4]).toMatchObject({
      day: 1,
      date: '2026-05-01',
    });

    expect(cells[34]).toMatchObject({
      day: 31,
      date: '2026-05-31',
    });
  });

  test('marks cells that have sessions', async () => {
    sessionStore.getCountsByMonthAndYear.mockReset();
    sessionStore.getCountsByMonthAndYear.mockResolvedValue({
      3: 2,
      14: 1,
    });

    await flushPromises();

    const cells = service.$calendarCells();

    expect(cells[6]).toMatchObject({
      day: 3,
      hasSessions: true,
      date: '2026-05-03',
    });

    expect(cells[17]).toMatchObject({
      day: 14,
      hasSessions: true,
      date: '2026-05-14',
    });

    expect(cells[18]).toMatchObject({
      day: 15,
      hasSessions: false,
      date: '2026-05-15',
    });
  });

  test('moves to the next month', async () => {
    await flushPromises();
    sessionStore.getCountsByMonthAndYear.mockClear();

    service.showNextMonth();

    await flushPromises();

    expect(service.$firstDayOfMonth().toString()).toBe('2026-06-01');
    expect(sessionStore.getCountsByMonthAndYear).toHaveBeenCalledWith(6, 2026);
  });

  test('moves to the previous month', async () => {
    await flushPromises();
    sessionStore.getCountsByMonthAndYear.mockClear();

    service.showPreviousMonth();

    await flushPromises();

    expect(service.$firstDayOfMonth().toString()).toBe('2026-04-01');
    expect(sessionStore.getCountsByMonthAndYear).toHaveBeenCalledWith(4, 2026);
  });
});
