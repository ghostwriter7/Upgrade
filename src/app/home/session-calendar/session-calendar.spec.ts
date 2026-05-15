import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCalendar } from './session-calendar';
import { SessionStore } from '../../store/session/session.store';

describe('SessionCalendar', () => {
  let component: SessionCalendar;
  let fixture: ComponentFixture<SessionCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionStore,
          useValue: {
            getCountsByMonthAndYear: vi.fn().mockResolvedValue({}),
          },
        },
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
});
