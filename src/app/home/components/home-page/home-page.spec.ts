import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';
import { Component } from '@angular/core';
import { SessionCalendar } from '../session-calendar/session-calendar';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';
import { SkillCoverage } from '@home/components/skill-coverage/skill-coverage';
import { TemplateSelector } from '@home/components/template-selector/template-selector';

@Component({
  selector: 'app-session-calendar',
  template: '<p>Calendar</p>',
})
class SessionCalendarMock {}

@Component({
  selector: 'app-skill-coverage',
  template: '<p>Skill Coverage</p>',
})
class SkillCoverageMock {}

@Component({
  selector: 'app-template-selector',
  template: '<div>Template Selector</div>',
})
export class TemplateSelectorMock {}

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
        add: { imports: [SessionCalendarMock, SkillCoverageMock, TemplateSelectorMock] },
        remove: { imports: [SessionCalendar, SkillCoverage, TemplateSelector] },
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
