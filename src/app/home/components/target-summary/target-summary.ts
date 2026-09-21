import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TargetStore } from '@store/target.store';
import { WeekProgress } from '@home/components/week-progress/week-progress';
import { SessionRepository } from '@persistence/repository/session.repository';
import { LibraryStore } from '@store/library.store';
import { MatChip } from '@angular/material/chips';
import { Session } from '@domain/model/session/session.model';

@Component({
  selector: 'app-target-summary',
  templateUrl: './target-summary.html',
  styleUrl: './target-summary.css',
  imports: [WeekProgress, MatChip],
})
export class TargetSummary implements OnInit {
  private readonly targetStore = inject(TargetStore);
  private readonly libraryStore = inject(LibraryStore);
  private readonly sessionRepository = inject(SessionRepository);

  protected readonly activeTargets = this.targetStore.targets;
  protected readonly hasActiveTargets = computed(() => !!this.activeTargets().length);

  private readonly relevantSessions = signal<Session[]>([]);

  protected readonly decoratedTargets = computed(() => {
    const sessions = this.relevantSessions();
    const skillsById = this.libraryStore.skillsById();

    return this.activeTargets().map((target) => {
      const { skillId } = target;

      const exercises = this.libraryStore.exerciseBySkillId().get(skillId) ?? [];
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
        skillName: skillsById[target.skillId]?.name,
        totalDuration: this.stringifyDurationInMinutes(totalDuration),
        desiredDuration: this.stringifyDurationInMinutes(target.weeklyCommitmentInMinutes),
        completionPercentage: Math.round((totalDuration / target.weeklyCommitmentInMinutes) * 100),
      };
    });
  });

  public ngOnInit(): void {
    const now = Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZoneId());
    const weekStart = now.subtract({ days: now.dayOfWeek - 1 }).startOfDay();

    this.sessionRepository
      .getSessionsForRange(weekStart.toPlainDateTime(), now.toPlainDateTime())
      .then((sessions) => this.relevantSessions.set(sessions));
  }

  private stringifyDurationInMinutes(value: number): string {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours && minutes) {
      return `${hours}h ${minutes}m`;
    }

    return minutes ? `${minutes}m` : `${hours}h`;
  }
}
