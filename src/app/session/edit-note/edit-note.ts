import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { SetForm } from '../set-form/set-form';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-edit-note',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    SetForm,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './edit-note.html',
  styleUrl: './edit-note.css',
})
export class EditNote {
  protected readonly data: { note: string } = inject(MAT_DIALOG_DATA);
}
