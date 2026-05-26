import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { SetForm } from '../set-form/set-form';
import { SetData } from '../set-form/set-data.interface';

@Component({
  selector: 'app-upsert-set',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, SetForm],
  templateUrl: './upsert-set.component.html',
  styleUrl: './upsert-set.component.css',
})
export class UpsertSet {
  private readonly data: { set: SetData, label: string; button: string; } = inject(MAT_DIALOG_DATA);
  protected readonly setData = this.data.set;

  protected readonly label = this.data.label ?? 'Edit Set';
  protected readonly button = this.data.button ?? 'Update';
}
