import { Component, input } from '@angular/core';

import { ExerciseLog } from '@domain/model/exercise-log/exercise-log.model';

@Component({
  selector: 'app-exercise-card',
  template: '<div>Exercise Card</div>',
})
export class ExerciseCardMock {
  public exerciseLog = input<ExerciseLog>();
  public isEditable = input(false);
  public isNonDeletable = input(false);
}
