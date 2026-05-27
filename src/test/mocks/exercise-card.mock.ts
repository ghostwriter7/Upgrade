import { Component, input } from '@angular/core';
import { ExerciseLog } from '../../app/domain/model/session.model';

@Component({
  selector: 'app-exercise-card',
  template: '<div>Exercise Card</div>',
})
export class ExerciseCardMock {
  public entry = input<ExerciseLog>();
  public isEditable = input(false);
  public isNonDeletable = input(false);
}
