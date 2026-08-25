import { Component, computed, inject, input } from '@angular/core';
import { Review, Target, TargetPriority, TargetStatus } from '@domain/model/target';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { PriorityLabels } from '../../consts/priority-options';
import { StatusLabels } from '../../consts/status-options';
import { SkillNamePipe } from '@ui/pipes/skill-name.pipe';
import { MatMiniFabButton } from '@angular/material/button';
import { TargetStore } from '@store/target.store';

const iconByStatus: Record<TargetStatus, string> = {
  active: 'play_circle',
  reviewing: 'rate_review',
  paused: 'pause_circle',
  achieved: 'check_circle',
  archived: 'archive',
};

const iconByPriority: Record<TargetPriority, string> = {
  primary: 'flag',
  secondary: 'outlined_flag',
  unprioritized: 'remove',
};

interface TargetViewModel extends Omit<
  Target,
  'createdAt' | 'startedAt' | 'targetDate' | 'nextReviewDate' | 'achievedAt' | 'reviews'
> {
  createdAt: string;
  startedAt?: string;
  targetDate?: string;
  nextReviewDate?: string;
  achievedAt?: string;
  reviews?: (Omit<Review, 'reviewedAt'> & { reviewedAt: string })[];
}

@Component({
  selector: 'app-target-view',
  templateUrl: './target-view.html',
  styleUrl: './target-view.css',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatIcon,
    MatListItem,
    MatList,
    MatDivider,
    MatChip,
    MatChipSet,
    SkillNamePipe,
    MatCardActions,
    MatMiniFabButton,
  ],
})
export class TargetView {
  public readonly target = input.required<Target>();
  protected readonly targetViewModel = computed(() => this.toTargetViewModel(this.target()));

  protected readonly targetStore = inject(TargetStore);
  protected readonly statusLabel = computed(() => StatusLabels[this.target().status]);
  protected readonly priorityLabel = computed(() => PriorityLabels[this.target().priority]);

  protected readonly hasReviews = computed(() => !!this.target().reviews?.length);

  protected readonly commitmentHours = computed(() => {
    const minutes = this.target().weeklyCommitmentInMinutes;
    const hours = minutes / 60;

    return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  });

  readonly statusIcon = computed(() => iconByStatus[this.target().status]);
  readonly priorityIcon = computed(() => iconByPriority[this.target().priority]);

  private formatInstant(value: Temporal.Instant | undefined): string {
    if (!value) {
      return 'Not set';
    }

    return value.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  private toTargetViewModel({
    createdAt,
    startedAt,
    targetDate,
    nextReviewDate,
    achievedAt,
    reviews,
    ...remaining
  }: Target): TargetViewModel {
    return {
      ...remaining,
      createdAt: this.formatInstant(createdAt),
      startedAt: this.formatInstant(startedAt),
      targetDate: this.formatInstant(targetDate),
      nextReviewDate: this.formatInstant(nextReviewDate),
      achievedAt: this.formatInstant(achievedAt),
      reviews: reviews?.map((review) => ({
        ...review,
        reviewedAt: this.formatInstant(review.reviewedAt),
      })),
    };
  }
}
