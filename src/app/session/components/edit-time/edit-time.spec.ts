import { getButton } from '../../../../test/harness.utils';
import { pad } from '../../../common/function/pad-time.function';

import { EditTime } from './edit-time';
import { OpenDialogFnResult, TestBedUtils } from '../../../../test/test-bed.utils';
import { EditTimeDialogData } from './edit-time-dialog-data.interface';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { DateHelper } from '../../../common/helper/date.helper';

describe('EditTime', () => {
  let openDialog: (data: EditTimeDialogData) => OpenDialogFnResult;

  const getTimeInput = (dialog: MatDialogHarness) => dialog.getHarness(MatInputHarness);
  const instant = Temporal.Instant.from('1994-07-07T10:15:00Z');

  beforeEach(async () => {
    const result = await TestBedUtils.configure({
      targetComponent: EditTime,
    });

    openDialog = (data: EditTimeDialogData) => result.openDialog(data);
  });

  it('should show dialog title from data label', async () => {
    const { dialog } = await openDialog({ label: 'Edit start time', instant });

    await expect(dialog.getTitleText()).resolves.toBe('Edit start time');
  });

  it('should initialize time input from provided instant in local time', async () => {
    const { dialog } = await openDialog({
      label: 'Edit time',
      instant,
    });

    const input = await getTimeInput(dialog);

    const localDateTime = DateHelper.toLocal(instant);
    const expectedValue = `${pad(localDateTime.hour)}:${pad(localDateTime.minute)}`;

    await expect(input.getValue()).resolves.toBe(expectedValue);
  });

  it('should close with updated instant when Update is clicked', async () => {
    const { dialog, result } = await openDialog({
      label: 'Edit time',
      instant,
    });

    const input = await getTimeInput(dialog);
    await input.setValue('22:45');

    const updateButton = await getButton(dialog, 'Update');
    await updateButton.click();

    const expectedInstant = DateHelper.toLocal(instant)
      .with({
        hour: 22,
        minute: 45,
      })
      .toInstant();

    await expect(result).resolves.toEqual(expectedInstant);
  });

  it('should close without result when Cancel is clicked', async () => {
    const { dialog, result } = await openDialog({
      label: 'Edit time',
      instant,
    });

    const cancelButton = await getButton(dialog, 'Cancel');
    await cancelButton.click();

    await expect(result).resolves.toBeNull();
  });
});
