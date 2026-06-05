import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCard } from './exercise-card';
import { Component, input, Pipe } from '@angular/core';
import { ExerciseCardActions } from '../exercise-card-actions/exercise-card-actions';
import { SetView } from '../set-view/set-view';
import { ExerciseNamePipe } from '@ui/pipes/exercise-name-pipe';
import { BodyweightSet, ExerciseSet } from '@domain/model/exercise-set.model';
import { By } from '@angular/platform-browser';
import { Mock } from 'vitest';
import { EventService } from '@common/service/event/event.service';
import { Subject } from 'rxjs';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { ExerciseLog } from '@domain/model/exercise-log.model';
import { ProgressGallery } from '@session/components/progress-gallery/progress-gallery';

@Component({
  selector: 'app-exercise-card-actions',
  template: '<div>Actions</div>',
})
export class ExerciseCardActionsMock {
  public entry = input<ExerciseLog | null>(null);
  public isNonDeletable = input<boolean>(false);
}

@Component({
  selector: 'app-progress-gallery',
  template: '<div>Progress Gallery</div>',
})
export class ProgressGalleryMock {
  public exerciseLogId = input.required<string>();
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
  let eventServiceMock: { listen: Mock };
  let eventSubject = new Subject<ElementClickedEvent>();

  const exercise = new ExerciseLog('sessionId', 'exerciseId').withSet(
    new BodyweightSet('sessionId', 'exerciseId', 0, 5),
  );

  beforeEach(async () => {
    eventServiceMock = { listen: vi.fn().mockReturnValue(eventSubject) };
    await TestBed.configureTestingModule({
      providers: [
        { provide: EventService, useValue: eventServiceMock },
      ],
      imports: [ExerciseCard],
    })
      .overrideComponent(ExerciseCard, {
        add: {
          imports: [ExerciseCardActionsMock, SetViewMock, ExerciseNamePipeMock, ProgressGalleryMock],
        },
        remove: {
          imports: [ExerciseCardActions, SetView, ExerciseNamePipe, ProgressGallery],
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
