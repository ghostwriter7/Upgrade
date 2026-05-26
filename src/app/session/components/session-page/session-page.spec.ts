import { ComponentFixture, TestBed } from '@angular/core/testing';

import SessionPage from './session-page';
import { Component, input } from '@angular/core';
import { SessionList } from '../session-list/session-list';
import { SessionStore } from '../../../store/session/session.store';
import { Mock } from 'vitest';
import { Router } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

@Component({
  selector: 'app-session-list',
  template: '<div>Session List</div>',
})
export class SessionListMock {
  public date = input();
}

describe('SessionPage', () => {
  let component: SessionPage;
  let fixture: ComponentFixture<SessionPage>;
  let sessionStoreMock: { setActiveDate: Mock };
  let routerMock: { navigate: Mock };
  let loader: HarnessLoader;
  const date = '1994-07-07';

  beforeEach(async () => {
    sessionStoreMock = { setActiveDate: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SessionStore, useValue: sessionStoreMock },
      ],
      imports: [SessionPage],
    });

    TestBed.overrideComponent(SessionPage, {
      add: { imports: [SessionListMock] },
      remove: { imports: [SessionList] },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(SessionPage);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('date', date);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const getButton = (testId: string) =>
    loader.getHarness(MatButtonHarness.with({ selector: `[data-testid="${testId}"]` }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active date in the session store', () =>
    expect(sessionStoreMock.setActiveDate).toHaveBeenCalledWith('1994-07-07'));

  it('should render formatted date label', () => {
    const label = fixture.nativeElement.querySelector(
      '[data-testid="session-page-date-label"]',
    ) as HTMLElement;

    expect(label.textContent?.trim()).toBe('Thursday, 7 July 1994');
  });

  it('should navigate to the previous day', async () => {
    const previousButton = await getButton('session-page-previous-day-btn');

    await previousButton.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/session', '1994-07-06']);
  });

  it('should navigate to the next day', async () => {
    const nextButton = await getButton('session-page-next-day-btn');

    await nextButton.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/session', '1994-07-08']);
  });
});
