import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCardActions } from './exercise-card-actions';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { getButtonByTestId } from '@test/harness.utils';
import { CommandBus } from '@common/routers/command/command-bus';
import { DialogService } from '@common/service/dialog/dialog.service';
import { Mock } from 'vitest';
import { ConfirmDeleteAlert } from '../confirm-delete-alert/confirm-delete-alert.component';
import { DeleteExerciseCommand } from '../../commands/delete-exercise/delete-exercise.command';
import { EditNote } from '../edit-note/edit-note';
import { EditExerciseNoteCommand } from '../../commands/edit-exercise-note/edit-exercise-note.command';
import { SetData } from '../set-form/set-data.interface';
import { CreateSetCommand } from '../../commands/create-set/create-set.command';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { CaptureProgressCommand } from '@session/commands/capture-progress/capture-progress.command';
import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';
import { MeasureProgress } from '@session/components/measure-progress/measure-progress';
import { MeasureProgressOutput } from '@session/components/measure-progress/measure-progress-output.interface';
import { Point } from '@domain/model/measurement.model';
import { QueryBus } from '@common/routers/query/query-bus';
import { GetInitialSetForExerciseIdQuery } from '@session/queries/get-initial-set-for-exercise-id/get-initial-set-for-exercise-id.query';

describe('ExerciseCardActions', () => {
  let component: ExerciseCardActions;
  let fixture: ComponentFixture<ExerciseCardActions>;
  let loader: HarnessLoader;
  let commandBusMock: { dispatch: Mock };
  let dialogServiceMock: { open: Mock };
  let queryBus: { execute: Mock };

  const exercise = new ExerciseLog('sessionId', 'any-id');

  beforeEach(async () => {
    commandBusMock = { dispatch: vi.fn() };
    dialogServiceMock = { open: vi.fn() };
    queryBus = { execute: vi.fn() };

    await TestBed.configureTestingModule({
      providers: [
        { provide: CommandBus, useValue: commandBusMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: QueryBus, useValue: queryBus },
      ],
      imports: [ExerciseCardActions],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCardActions);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('entry', exercise);
    fixture.componentRef.setInput('isNonDeletable', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const callCallback = (data: unknown = undefined) => dialogServiceMock.open.mock.calls[0][1](data);

  const getDeleteButton = () =>
    getButtonByTestId(loader, `exercise-card-actions-delete-btn-${exercise.exerciseId}`);

  it('should delete an exercise', async () => {
    const button = await getDeleteButton();

    await button.click();

    callCallback();
    expect(dialogServiceMock.open).toHaveBeenCalledExactlyOnceWith(
      ConfirmDeleteAlert,
      expect.any(Function),
    );
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new DeleteExerciseCommand(exercise.exerciseId),
    );
  });

  it('should keep delete button disabled when non-deletable', async () => {
    fixture.componentRef.setInput('isNonDeletable', true);
    fixture.detectChanges();

    const button = await getDeleteButton();

    await button.click();

    await expect(button.isDisabled()).resolves.toBe(true);
    expect(commandBusMock.dispatch).not.toHaveBeenCalled();
  });

  it('should edit note', async () => {
    const button = await getButtonByTestId(
      loader,
      `exercise-card-actions-edit-note-btn-${exercise.exerciseId}`,
    );

    await button.click();

    callCallback('Updated Note');
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new EditExerciseNoteCommand('Updated Note', exercise.exerciseId),
    );
    expect(dialogServiceMock.open).toHaveBeenCalledExactlyOnceWith(
      EditNote,
      expect.any(Function),
      {
        data: { note: exercise.notes },
        width: '90svw',
        height: '90svh',
      },
      expect.any(Function),
    );
  });

  it('should show set form and handle its response', async () => {
    const button = await getButtonByTestId(
      loader,
      `exercise-card-actions-show-set-form-btn-${exercise.exerciseId}`,
    );
    const setData: SetData = {
      reps: 1,
      weight: 0,
      duration: 0,
      type: 'bodyweight',
    };
    queryBus.execute.mockResolvedValue(setData);

    await button.click();

    callCallback(setData);
    expect(queryBus.execute).toHaveBeenCalledExactlyOnceWith(
      new GetInitialSetForExerciseIdQuery(exercise.exerciseId),
    );
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new CreateSetCommand(setData, exercise.exerciseId),
    );
    expect(dialogServiceMock.open).toHaveBeenCalledExactlyOnceWith(
      UpsertSet,
      expect.any(Function),
      {
        data: {
          set: { type: 'bodyweight', reps: 1, weight: 0, duration: 0 },
          label: 'Add Set',
          button: 'Save',
        },
      },
    );
  });

  it('should trigger video capturing', async () => {
    const button = await getButtonByTestId(
      loader,
      `exercise-card-actions-video-capture-btn-${exercise.exerciseId}`,
    );
    const result: MeasureProgressOutput = {
      image: new Blob(),
      width: 100,
      height: 100,
      points: [new Point(0, 0), new Point(1, 1)],
      angle: 120,
    };

    await button.click();

    callCallback(result);
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new CaptureProgressCommand(
        result.image,
        result.width,
        result.height,
        result.angle,
        result.points,
        exercise.exerciseId,
      ),
    );
    expect(dialogServiceMock.open).toHaveBeenCalledExactlyOnceWith(
      MeasureProgress,
      expect.any(Function),
      {
        width: '90svw',
        height: '90svh',
      },
    );
  });
});
