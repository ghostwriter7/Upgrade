import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCard } from './exercise-card';
import { Component, input, Pipe } from '@angular/core';
import { ExerciseCardActions } from '../exercise-card-actions/exercise-card-actions';
import { SetView } from '../set-view/set-view';
import { ExerciseNamePipe } from '../../../ui/pipes/exercise-name-pipe';
import { ExerciseLog } from '../../../domain/model/session.model';
import { BodyweightSet, ExerciseSet } from '../../../domain/model/exercise-set.model';
import { By } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Mock } from 'vitest';
import { EntryDetails } from '../entry-details/entry-details';
import { EventService } from '../../../common/service/event/event.service';
import { EMPTY, of, Subject } from 'rxjs';
import { ElementClickedEvent } from '../../../common/events/element-clicked.event';

@Component({
  selector: 'app-exercise-card-actions',
  template: '<div>Actions</div>',
})
export class ExerciseCardActionsMock {
  public entry = input<ExerciseLog | null>(null);
  public isNonDeletable = input<boolean>(false);
}

@Component({
  selector: 'app-set-view',
  template: '<div>Set View</div>',
})
export class SetViewMock {
  public set = input<ExerciseSet | null>(null);
  public isEditable = input<boolean>(false);
}

@Pipe({
  name: 'exerciseName',
})
export class ExerciseNamePipeMock {
  public transform() {
    return 'Front Splits';
  }
}

describe('ExerciseCard', () => {
  let component: ExerciseCard;
  let fixture: ComponentFixture<ExerciseCard>;
  let matBottomSheetMock: { open: Mock };
  let eventServiceMock: { listen: Mock };
  let eventSubject = new Subject<ElementClickedEvent>();

  const exercise = new ExerciseLog('exerciseId').withSet(
    new BodyweightSet('sessionId', 'exerciseId', 0, 5),
  );

  beforeEach(async () => {
    matBottomSheetMock = { open: vi.fn() };
    eventServiceMock = { listen: vi.fn().mockReturnValue(eventSubject) };
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatBottomSheet, useValue: matBottomSheetMock },
        { provide: EventService, useValue: eventServiceMock },
      ],
      imports: [ExerciseCard],
    })
      .overrideComponent(ExerciseCard, {
        add: {
          imports: [ExerciseCardActionsMock, SetViewMock, ExerciseNamePipeMock],
        },
        remove: {
          imports: [ExerciseCardActions, SetView, ExerciseNamePipe],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExerciseCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('entry', exercise);
    fixture.componentRef.setInput('isNonDeletable', false);
    await fixture.whenStable();
  });

  afterEach(() => eventSubject.complete());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getActions = () => fixture.debugElement.query(By.css('app-exercise-card-actions'));
  const getHeader = () =>
    fixture.debugElement.query(By.css(`[data-testid=exercise-card-header-${exercise.exerciseId}]`))
      .nativeElement as HTMLDivElement;
  const getShowMediaButton = () =>
    fixture.debugElement.query(
      By.css(`[data-testid=exercise-card-show-media-button-${exercise.exerciseId}]`),
    )?.nativeElement as HTMLButtonElement | undefined;

  it('should display action buttons upon clicking on the header', () => {
    fixture.componentRef.setInput('isEditable', true);
    getHeader().click();

    fixture.detectChanges();

    expect(getActions()).toBeDefined();
  });

  it('should do nothing upon clicking on the header when non-editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    getHeader().click();

    fixture.detectChanges();

    expect(getActions()).toBeNull();
  });

  it('should not display the Show Media button when the exercise log has no associated media', () =>
    expect(getShowMediaButton()).toBeUndefined());

  it('should open the exercise details sheet upon clicking on the Show Media button', () => {
    const exerciseWithMedia = exercise.withMedia('media-id');
    fixture.componentRef.setInput('entry', exerciseWithMedia);
    fixture.detectChanges();

    getShowMediaButton()?.click();
    fixture.detectChanges();

    expect(matBottomSheetMock.open).toHaveBeenCalledExactlyOnceWith(EntryDetails, {
      data: { exerciseLog: exerciseWithMedia },
      height: '80svh',
    });
  });

  it('should listen for ElementClickedEvent', () =>
    expect(eventServiceMock.listen).toHaveBeenCalledExactlyOnceWith(ElementClickedEvent));

  it('should hide actions when the ElementClickedEvent is emitted with a source outside of the exercise card', () => {
    getHeader().click();
    fixture.detectChanges();
    expect(getActions()).toBeDefined();

    const event = new ElementClickedEvent(document.createElement('div'));
    eventSubject.next(event);

    fixture.detectChanges();

    expect(getActions()).toBeNull();
  });

  it('should not hide actions when the ElementClickedEvent is emitted with a source inside of the header', () => {
    getHeader().click();
    fixture.detectChanges();
    expect(getActions()).toBeDefined();

    eventSubject.next(new ElementClickedEvent(getHeader()));

    fixture.detectChanges();

    expect(getActions()).toBeDefined();
  });
});
