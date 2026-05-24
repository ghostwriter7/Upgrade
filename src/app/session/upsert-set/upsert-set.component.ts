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
  selector: 'app-upsert-set',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, SetForm],
  templateUrl: './upsert-set.component.html',
  styleUrl: './upsert-set.component.css',
})
export class UpsertSet {
  private readonly data: { set: ExerciseSet, label: string; button: string; } = inject(MAT_DIALOG_DATA);
  protected readonly setData = SetDataMapper.toDto(this.data.set);
  private readonly dialogRef = inject(MatDialogRef)

  protected readonly label = this.data.label ?? 'Edit Set';
  protected readonly button = this.data.button ?? 'Update';

  protected handleUpdate(setData: SetData): void {
    const { exerciseId, sessionId, index = 0 } = this.data.set;
    const exerciseSet = SetDataMapper.toDomain(setData, exerciseId, sessionId, index);
    this.dialogRef.close(exerciseSet);
  }
}
