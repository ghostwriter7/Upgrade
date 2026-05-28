import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCalendar } from './session-calendar';
import { SessionCalendarService } from './session-calendar.service';
import { signal, WritableSignal } from '@angular/core';
import { CalendarCell } from './session-calendar.model';
import { Mock } from 'vitest';
import { By } from '@angular/platform-browser';

describe('SessionCalendar', () => {
  let component: SessionCalendar;
  let fixture: ComponentFixture<SessionCalendar>;
  let sessionCalendarService: {
    $firstDayOfMonth: WritableSignal<Temporal.PlainDate>;
    $calendarCells: WritableSignal<CalendarCell[]>;
    showNextMonth: Mock;
    showPreviousMonth: Mock;
  };

  const date = Temporal.PlainDate.from('1994-07-07');

  beforeEach(async () => {
    sessionCalendarService = {
      $firstDayOfMonth: signal(date),
      $calendarCells: signal([]),
      showNextMonth: vi.fn(),
      showPreviousMonth: vi.fn(),
    }

    await TestBed.configureTestingModule({
      providers: [
        { provide: SessionCalendarService, useValue: sessionCalendarService },
      ],
      imports: [SessionCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate to the SessionCalendarService upon clicking on the Show Next Month button', () => {
    const showNextMonthButton = fixture.debugElement.query(By.css('button[data-testid="session-calendar-show-next-month"]'));

    showNextMonthButton.triggerEventHandler('click', null);

    expect(sessionCalendarService.showNextMonth).toHaveBeenCalled();
  });

  it('should delegate to the SessionCalendarService upon clicking on the Show Prev Month button', () => {
    const showNextMonthButton = fixture.debugElement.query(
      By.css('button[data-testid="session-calendar-show-prev-month"]'),
    );

    showNextMonthButton.triggerEventHandler('click', null);

    expect(sessionCalendarService.showPreviousMonth).toHaveBeenCalled();
  });


});
