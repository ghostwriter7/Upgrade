import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionHeader } from '../session-header/session-header';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SESSION } from '../../consts/session.token';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-session-view',
  imports: [ReactiveFormsModule, SessionHeader, ExerciseCard, SessionActions],
  providers: [DialogService],
  templateUrl: './session-view.html',
  styleUrl: './session-view.css',
})
export default class SessionView {
  protected readonly session = inject(SESSION);
}
