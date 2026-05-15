import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { MatButton } from '@angular/material/button';
import { SetData, SetForm } from '../set-form/set-form';
import { SetDataMapper } from '../set-form/mapper/set-data.mapper';

@Component({
  selector: 'app-edit-set',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, SetForm],
  templateUrl: './edit-set.html',
  styleUrl: './edit-set.css',
})
export class EditSet {
  private readonly data: { set: ExerciseSet } = inject(MAT_DIALOG_DATA);
  protected readonly setData = SetDataMapper.toDto(this.data.set);
  private readonly dialogRef = inject(MatDialogRef)

  protected handleUpdate(setData: SetData): void {
    const exerciseSet = SetDataMapper.toDomain(setData);
    this.dialogRef.close(exerciseSet);
  }
}
