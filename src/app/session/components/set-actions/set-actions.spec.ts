import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateSetCommand } from '../../commands/update-set/update-set.command';
import { SetData } from '../set-form/set-data.interface';

import { SetActions } from './set-actions';
import { DialogService } from '@common/service/dialog/dialog.service';
import { CommandBus } from '@common/routers/command/command-bus';
import { Mock } from 'vitest';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { CopySetCommand } from '../../commands/copy-set/copy-set.command';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { UpsertSetDialogData } from '../upsert-set/upsert-set-dialog-data.interface';
import { DeleteSetCommand } from '../../commands/delete-set/delete-set.command';
import { getButtonByTestId } from '@test/harness.utils';
import { bwSet } from '@test/fixtures/exercise-set.fixtures';

describe('SetActions', () => {
  let component: SetActions;
  let fixture: ComponentFixture<SetActions>;
  let dialogServiceMock: { open: Mock };
  let loader: HarnessLoader;
  let commandBusMock: { dispatch: Mock };

  const set = bwSet(0, 10);

  beforeEach(async () => {
    dialogServiceMock = { open: vi.fn() };
    commandBusMock = { dispatch: vi.fn() };

    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: CommandBus, useValue: commandBusMock },
      ],
      imports: [SetActions],
    }).compileComponents();

    fixture = TestBed.createComponent(SetActions);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('set', set);
    await fixture.whenStable();
  });

  const click = async (button: string) => {
    const btn = await getButtonByTestId(loader, `set-actions-${button}-btn`);
    return btn.click();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch copy command when copy button is clicked', async () => {
    await click('copy');

    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(new CopySetCommand(set));
  });

  it('should open edit dialog when edit button is clicked', async () => {
    await click('edit');

    expect(dialogServiceMock.open).toHaveBeenCalledExactlyOnceWith(
      UpsertSet,
      expect.any(Function),
      expect.objectContaining({
        data: {
          set: {
            reps: 10,
            duration: 0,
            weight: 0,
            type: 'bodyweight',
          },
          exerciseId: set.exerciseId,
        },
      }),
    );
  });

  it('should dispatch update command when edit dialog closes with set data', async () => {
    await click('edit');

    const [, afterClosedHandler] = dialogServiceMock.open.mock.calls[0] as [
      typeof UpsertSet,
      (setData: SetData) => void,
      { data: UpsertSetDialogData },
    ];

    afterClosedHandler({
      reps: 15,
      duration: 0,
      weight: 0,
      type: 'bodyweight',
    });

    const expectedSet = bwSet(0, 15);
    expectedSet.id = set.id;
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(
      new UpdateSetCommand(expectedSet),
    );
  });

  it('should emit setDelete and dispatch delete command when delete button is clicked', async () => {
    const setDeleteHandler = vi.fn();

    fixture.componentRef.instance.setDelete.subscribe(setDeleteHandler);

    await click('delete');

    expect(setDeleteHandler).toHaveBeenCalledOnce();
    expect(commandBusMock.dispatch).toHaveBeenCalledExactlyOnceWith(new DeleteSetCommand(set));
  });
});
