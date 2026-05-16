import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ExerciseLog } from '../../domain/model/session.model';
import { SetData, SetForm } from '../set-form/set-form';
import { SetDataMapper } from '../set-form/mapper/set-data.mapper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-set-form',
  imports: [ReactiveFormsModule, MatMiniFabButton, MatIcon, SetForm],
  templateUrl: './add-set-form.html',
  styleUrl: './add-set-form.css',
})
export class AddSetForm {
  public exerciseLog = input.required<ExerciseLog>();
  public newSet = output<ExerciseSet>();
  public cancelAddSet = output<void>();

  protected readonly setModel = signal<SetData>({
    type: 'bodyweight',
    reps: 1,
    weight: 0,
    duration: 0,
    breathQuality: null,
    exposureZone: null,
    depth: null
  });

  protected addSet(): void {
    const exerciseSet = SetDataMapper.toDomain(this.setModel());
    this.newSet.emit(exerciseSet);
  }

}
