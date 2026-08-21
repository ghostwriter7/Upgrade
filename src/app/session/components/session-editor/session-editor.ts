import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { ExerciseCard } from '../exercise-card/exercise-card';
import { SessionActions } from '../session-actions/session-actions';
import { SessionHeader } from '../session-header/session-header';
import { Timer } from '../timer/timer';
import { SessionStateHolder } from '../../store/session-state-holder.store';
import { SessionStore } from '@store/session/session.store';
import { DialogService } from '@common/service/dialog/dialog.service';
import { CommandBus } from '@common/routers/command/command-bus';
import { CreateSessionCommand } from '../../commands/create-session/create-session-command';
import { ExerciseStore } from '@store/exercises.store';
import { SkillStore } from '@store/skill.store';
import { Skill } from '@domain/model/skill';

@Component({
  selector: 'app-session-editor',
  imports: [ExerciseCard, SessionActions, SessionHeader, Timer],
  templateUrl: './session-editor.html',
  providers: [DialogService],
  styleUrl: './session-editor.css',
})
export default class SessionEditor implements OnInit, OnDestroy {
  public isNew = input(false);
  public skill = input<Skill | undefined, string | undefined>(undefined, {
    transform: (skillId) => (skillId ? this.skillStore.skillsById()[skillId] : undefined),
  });

  private readonly sessionStateHolder = inject(SessionStateHolder);
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly sessionStore = inject(SessionStore);
  private readonly skillStore = inject(SkillStore);
  private readonly commandBus = inject(CommandBus);

  protected readonly session = this.sessionStateHolder.session;

  public ngOnInit(): void {
    this.exerciseStore.setActiveSkill(this.skill());
    if (this.isNew()) {
      this.commandBus.dispatch(new CreateSessionCommand());
    }
  }

  public ngOnDestroy(): void {
    const session = this.sessionStateHolder.session();
    if (session) {
      this.sessionStore.updateCache(session);
      if (!this.isNew()) this.sessionStateHolder.set(null);
    }
    this.exerciseStore.setActiveSkill(undefined);
  }
}
