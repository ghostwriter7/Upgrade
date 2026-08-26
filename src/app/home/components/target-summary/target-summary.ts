import { Component, computed, inject } from '@angular/core';
import { TargetStore } from '@store/target.store';
import { WeekProgress } from '@home/components/week-progress/week-progress';

@Component({
  selector: 'app-target-summary',
  templateUrl: './target-summary.html',
  styleUrl: './target-summary.css',
  host: {
    class: 'd-contents',
  },
  imports: [WeekProgress],
})
export class TargetSummary {
  private readonly targetStore = inject(TargetStore);

  private readonly activeTargets = computed(() =>
    this.targetStore.targets().filter((target) => target.status === 'active'),
  );
  protected readonly hasActiveTargets = computed(() => !!this.activeTargets().length);
}
