import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  RateOfPerceivedEffort,
  RateOfPerceivedEffortOptions,
} from '@domain/enum/rate-of-perceived-effort-value';
import { RateOfPerceivedEffortIconPipe } from '@templates/pipes/rate-of-perceived-effort-icon.pipe';
import { TemplateFacade } from '@templates/template.facade';
import { SessionFacade } from '@session/session.facade';
import { Template } from '@domain/model/template/template.model';
import { CreateFromTemplateCommand } from '@session/commands/create-from-template/create-from-template.command';
import { CommandBus } from '@common/routers/command/command-bus';
import { Router } from '@angular/router';
import { Session } from '@domain/model/session/session.model';

type TemplateStat = { executionCount: number; ageHours: number; template: Template };
type TemplateStats = Map<String, TemplateStat>;

@Component({
  selector: 'app-random-session-control',
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, RateOfPerceivedEffortIconPipe],
  templateUrl: './random-session-control.html',
  styleUrl: './random-session-control.css',
  host: {
    '[class.d-none]': 'isHidden()',
  },
})
export class RandomSessionControl {
  private readonly templateFacade = inject(TemplateFacade);
  private readonly sessionFacade = inject(SessionFacade);
  private readonly commandBus = inject(CommandBus);
  private readonly router = inject(Router);
  private readonly sessionCount = 50;

  protected readonly templates = this.templateFacade.$templatesByRPE;

  protected readonly options = computed(() => {
    const templatesByRPE = this.templateFacade.$templatesByRPE();

    return RateOfPerceivedEffortOptions.filter(({ value }) => templatesByRPE[value]?.length);
  });
  protected readonly isHidden = computed(() => !this.options().length);

  protected async startRandomSession(rpe?: RateOfPerceivedEffort): Promise<void> {
    const templates = rpe
      ? this.templateFacade.$templatesByRPE()[rpe] || []
      : this.templateFacade.$templates();

    if (!templates.length) return;

    const sessions = await this.sessionFacade.getLastXSessions(this.sessionCount);

    if (!sessions.length) {
      const index = Math.floor(Math.random() * templates.length);
      const template = templates[index];
      this.startSessionFromRandomTemplate(template);
    } else {
      const templateStats: TemplateStats = this.buildTemplateStats(templates);
      this.populateStatsWithSessionData(templateStats, sessions);

      const records = templateStats.values().toArray();

      const maxCount = Math.max(...records.map(({ executionCount }) => executionCount), 1);

      const scored = records
        .map((stats) => ({
          ...stats,
          score: this.scoreTemplate(maxCount, stats),
        }))
        .sort((a, b) => b.score - a.score);

      this.startSessionFromRandomTemplate(scored[0].template);
    }
  }

  private buildTemplateStats(templates: Template[]): TemplateStats {
    return templates.reduce((stats, template) => {
      const key = this.buildTemplateKey(template.exerciseIds);
      stats.set(key, { executionCount: 0, ageHours: Number.MAX_SAFE_INTEGER, template });
      return stats;
    }, new Map());
  }

  private buildTemplateKey(exerciseIds: string[]): string {
    return exerciseIds.join('|');
  }

  private populateStatsWithSessionData(templateStats: TemplateStats, sessions: Session[]): void {
    const now = Temporal.Now.instant();

    for (const session of sessions) {
      const templateKey = this.buildTemplateKey(session.exerciseIds);

      if (!templateStats.has(templateKey)) continue;

      const stats = templateStats.get(templateKey)!;
      stats.executionCount++;

      const { hours } = now.since(session.createdAt, { largestUnit: 'hour' });
      stats.ageHours = Math.min(stats.ageHours, hours);
    }
  }

  private startSessionFromRandomTemplate(template: Template): void {
    this.commandBus.dispatch(new CreateFromTemplateCommand(template));
    this.router.navigate(['session', 'edit']);
  }

  private scoreTemplate(maxCount: number, stats: TemplateStat): number {
    const frequency = 1 - stats.executionCount / maxCount;
    const recency = 1 - Math.exp(-stats.ageHours / (24 * 5));

    return 0.6 * recency + 0.25 * frequency;
  }
}
