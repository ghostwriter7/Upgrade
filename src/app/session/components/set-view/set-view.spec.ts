import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetView } from './set-view';
import { Component, input, output } from '@angular/core';
import {
  BodyweightSet,
  ExerciseSet,
  IsoSet,
  WeightedSet,
} from '@domain/model/exercise-set/exercise-set.model';
import { SetActions } from '../set-actions/set-actions';
import { Mock } from 'vitest';
import { EventService } from '@common/service/event/event.service';
import { Subject } from 'rxjs';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-set-actions',
  template: '<div></div>',
})
class SetActionsMock {
  public set = input.required<ExerciseSet>();
  public setDelete = output<void>();
}

describe('SetView', () => {
  let component: SetView;
  let fixture: ComponentFixture<SetView>;
  let eventServiceMock: { listen: Mock };
  let elementClicked$: Subject<ElementClickedEvent>;

  const set = new BodyweightSet('sessionId', 'exerciseId', 5, 10);

  beforeEach(async () => {
    elementClicked$ = new Subject<ElementClickedEvent>();
    eventServiceMock = { listen: vi.fn().mockReturnValue(elementClicked$) };

    await TestBed.configureTestingModule({
      imports: [SetView],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
    })
      .overrideComponent(SetView, {
        add: { imports: [SetActionsMock] },
        remove: { imports: [SetActions] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SetView);
    fixture.componentRef.setInput('set', set);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  const getText = (): string => fixture.nativeElement.textContent.trim();

  const clickHost = (): void => {
    ((fixture.nativeElement as HTMLElement).querySelector('.info') as HTMLDivElement)?.click();
    fixture.detectChanges();
  };

  const setInput = (key: string, value: any) => {
    fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
  };

  const setSet = (set: ExerciseSet) => setInput('set', set);

  const setIsEditable = (isEditable: boolean) => setInput('isEditable', isEditable);

  const getSetActions = () => fixture.debugElement.query(By.css('app-set-actions'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen for element clicked events', () =>
    expect(eventServiceMock.listen).toHaveBeenCalledExactlyOnceWith(ElementClickedEvent));

  test.each([
    { set: new BodyweightSet('sessionId', 'exerciseId', 5, 10), message: '10 reps' },
    { set: new WeightedSet('sessionId', 'exerciseId', 5, 8, 60), message: '8 reps + 60 kg' },
    { set: new IsoSet('sessionId', 'exerciseId', 5, 30, 0), message: '30 seconds' },
    { set: new IsoSet('sessionId', 'exerciseId', 5, 30, 20), message: '30 seconds + 20 kg' },
  ])('should display set value', ({ set, message }) => {
    setSet(set);

    expect(getText()).toContain(message);
  });

  it('should not show set actions by default', () => expect(getSetActions()).toBeNull());

  it('should not show set actions when clicked and not editable', () => {
    setIsEditable(false);

    clickHost();

    expect(getSetActions()).toBeNull();
  });

  it('should show set actions when clicked and editable', () => {
    setIsEditable(true);

    clickHost();

    expect(getSetActions()).toBeDefined();
  });

  it('should hide set actions when another element is clicked', () => {
    setIsEditable(true);

    clickHost();

    expect(getSetActions()).toBeDefined();

    const outsideElement = document.createElement('div');
    elementClicked$.next(new ElementClickedEvent(outsideElement));
    fixture.detectChanges();

    expect(getSetActions()).toBeNull();
  });

  it('should keep set actions visible when a contained element is clicked', () => {
    setIsEditable(true);

    clickHost();

    expect(getSetActions()).toBeDefined();

    const containedElement = fixture.nativeElement.querySelector(
      '[data-testid="set-actions-mock"]',
    ) as HTMLElement;

    elementClicked$.next(new ElementClickedEvent(containedElement));
    fixture.detectChanges();

    expect(getSetActions()).toBeDefined();
  });

  it('should hide set actions when setDelete is emitted by SetActions', () => {
    setIsEditable(true);

    clickHost();

    const setActions = getSetActions();
    expect(setActions).toBeDefined();

    (setActions.componentInstance as SetActionsMock).setDelete.emit();
    fixture.detectChanges();

    expect(getSetActions()).toBeNull();
  });
});
