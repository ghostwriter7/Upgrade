import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';
import { Component } from '@angular/core';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  selector: 'app-session-calendar',
  template: '<p>Calendar</p>',
})
export class SessionCalendarMock {}

@Component({ selector: 'app-session', template: '' })
class SessionMock {}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'session/new',
            component: SessionMock,
          },
          {
            path: '',
            component: HomePage,
            pathMatch: 'full',
          },
        ]),
      ],
      imports: [HomePage],
    })
      .overrideComponent(HomePage, {
        add: { imports: [SessionCalendarMock] },
        remove: { imports: [SessionCalendar] },
      })
      .compileComponents();

    harness = await RouterTestingHarness.create('/');
  });

  it('should redirect to /session/new upon clicking Start Session', async () => {
    await harness.navigateByUrl('/', HomePage);

    harness.fixture.debugElement
      .query(By.css('[data-testid="home-create-session-btn"]'))
      .nativeElement.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/session/new');
  });
});
