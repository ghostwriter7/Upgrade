import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

export const getButton = (dialog: MatDialogHarness, text: string) =>
  dialog.getHarness(MatButtonHarness.with({ text }));
