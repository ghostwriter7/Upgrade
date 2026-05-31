import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionHeader } from '../session-header/session-header';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { Session } from '../../../domain/model/session/session.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [ReactiveFormsModule, SessionHeader, ExerciseCard],
  providers: [DialogService],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  public session = input.required<Session>();
}
