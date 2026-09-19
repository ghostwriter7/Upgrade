import { Component, computed, inject, linkedSignal, OnInit } from '@angular/core';
import { TargetStore } from '@store/target.store';
import { WeekProgress } from '@home/components/week-progress/week-progress';
import { SessionRepository } from '@persistence/repository/session.repository';
import { ExerciseStore } from '@store/exercises.store';
import { Target } from '@domain/model/target';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';

interface TargetViewModel extends Target {
  completionPercentage?: number;
}

@Component({
  selector: 'app-target-summary',
  templateUrl: './target-summary.html',
  styleUrl: './target-summary.css',
  imports: [WeekProgress, MatChip, MatIcon],
})
export class TargetSummary implements OnInit {
  private readonly targetStore = inject(TargetStore);
  private readonly exerciseStore = inject(ExerciseStore);
  private readonly sessionRepository = inject(SessionRepository);

  protected readonly activeTargets = this.targetStore.targets;
  protected readonly hasActiveTargets = computed(() => !!this.activeTargets().length);

  protected readonly decoratedTargets = linkedSignal<TargetViewModel[]>(() => this.activeTargets());

  public ngOnInit(): void {
    const now = Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZoneId());
    const weekStart = now.subtract({ days: now.dayOfWeek - 1 }).startOfDay();

    this.sessionRepository
      .getSessionsForRange(weekStart.toPlainDateTime(), now.toPlainDateTime())
      .then((sessions) => {
        /*
          1. Each Target corresponds to a Skill
          2. Each Skill has dependencies (capabilities).
          3. Each Session consists of drills that develop capabilities
          4. For Each Target, I need to check what sessions have contributed to it
          5. Once I know the sessions, I can compute their total duration (completedAt - startedAt)
          6. Then I can complete the percentage of the weekly commitment

          7. In the next iteration, I can check the sessions more granularly (not every drill contributes, so only a slice of a session is valuable)
         */

        const decoratedTargets: TargetViewModel[] = this.activeTargets().map((target) => {
          const { skillId } = target;

          const exercises = this.exerciseStore.exerciseBySkillId().get(skillId) ?? [];
          const exerciseIds = new Set(exercises.map((e) => e.id));

          const contributingSessions = sessions.filter((s) =>
            s.exerciseIds?.some((id) => exerciseIds.has(id)),
          );

          const totalDuration = contributingSessions
            .filter((s) => s.finishedAt !== null)
            .map((s) => s.finishedAt!.since(s.startedAt, { largestUnit: 'minutes' }))
            .reduce((total, duration) => total + duration.minutes, 0);

          return {
            ...target,
            completionPercentage: Math.round(
              (totalDuration / target.weeklyCommitmentInMinutes) * 100,
            ),
          };
        });

        this.decoratedTargets.set(decoratedTargets);
      });
  }
}
