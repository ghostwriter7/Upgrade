import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ExerciseStore } from '../../store/exercises.store';
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

  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly setModel = signal<SetData>({
    type: 'bodyweight',
    reps: 1,
    weight: 0,
    duration: 0,
  });
  protected readonly isCloneDisabled = computed(() => this.exerciseLog().isEmpty);
  protected readonly showForm = signal(false);

  protected addSet(): void {
    const exerciseSet = SetDataMapper.toDomain(this.setModel());
    this.newSet.emit(exerciseSet);
    this.showForm.set(false);
  }

  protected copyLastSet(): void {
    const lastSet = this.exerciseLog().sets.at(-1);
    if (lastSet) {
      this.newSet.emit(lastSet);
    }
  }
}
