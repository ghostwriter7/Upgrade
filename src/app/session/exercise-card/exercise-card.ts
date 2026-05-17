import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AddSetForm } from '../add-set-form/add-set-form';
import { ExerciseNamePipe } from '../../ui/pipes/exercise-name-pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatMiniFabButton } from '@angular/material/button';
import { SetView } from '../set-view/set-view';
import { ExerciseLog } from '../../domain/model/session.model';
import { ExerciseSet } from '../../domain/model/exercise-set.model';
import { SessionEditorService } from '../services/session-editor.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-card',
  imports: [
    AddSetForm,
    ExerciseNamePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatMenu,
    MatMenuItem,
    MatMiniFabButton,
    SetView,
    MatMenuTrigger,
  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.css',
})
export class ExerciseCard {
  public entry = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  private readonly sessionEditor = inject(SessionEditorService);
  protected readonly isEditable = this.sessionEditor.$isEditable;
  protected readonly setFormActiveForExerciseId = this.sessionEditor.$setFormActiveForExerciseId;

  protected showSetForm(exerciseId: string): void {
    this.sessionEditor.showSetFormForExerciseId(exerciseId);
  }

  protected copyLastSet(exerciseId: string): void {
    this.sessionEditor.copyLastSet(exerciseId);
  }

  protected editExerciseNote(exerciseLog: ExerciseLog): void {
    this.sessionEditor.editExerciseNote(exerciseLog);
  }

  protected deleteExercise(exerciseLog: ExerciseLog): void {
    this.sessionEditor.deleteExercise(exerciseLog);
  }

  protected deleteSet(exerciseId: string, $index: number): void {
    this.sessionEditor.deleteSet(exerciseId, $index);
  }

  protected editSet(exerciseId: string, set: ExerciseSet, $index: number): void {
    this.sessionEditor.editSet(exerciseId, set, $index);
  }

  protected addSet($event: ExerciseSet, exerciseId: string): void {
    this.sessionEditor.addSet($event, exerciseId);
  }

  protected onCancelAddSet(): void {
    this.sessionEditor.cancelAddSet();
  }
}
