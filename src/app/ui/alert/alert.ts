import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-alert',
  imports: [MatDialogContent, MatDialogTitle, MatDialogActions, MatButton, MatDialogClose],
  templateUrl: './alert.html',
})
export class Alert {
  protected readonly data: { message: string } = inject(MAT_DIALOG_DATA);
}
