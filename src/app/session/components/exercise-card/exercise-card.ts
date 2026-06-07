import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ExerciseNamePipe } from '@ui/pipes/exercise-name-pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { SetView } from '../set-view/set-view';
import { EventService } from '@common/service/event/event.service';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExerciseCardActions } from '../exercise-card-actions/exercise-card-actions';
import { ExerciseLog } from '@domain/model/exercise-log.model';
import { ProgressGallery } from '@session/components/progress-gallery/progress-gallery';
import { ExerciseLogSummary } from '@session/components/exercise-log-summary/exercise-log-summary';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-card',
  imports: [
    ExerciseNamePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    SetView,
    ExerciseCardActions,
    ProgressGallery,
    ExerciseLogSummary,
  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.css',
})
export class ExerciseCard {
  public isEditable = input(false);
  public exerciseLog = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  protected readonly testIds = computed(() => {
    const { exerciseId } = this.exerciseLog();
    return {
      exerciseCardHeader: `exercise-card-header-${exerciseId}`,
      showMediaButton: `exercise-card-show-media-button-${exerciseId}`,
    };
  });

  protected readonly displayActions = signal(false);
  private readonly header = viewChild.required(MatCardHeader, { read: ElementRef });
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.eventService
      .listen(ElementClickedEvent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ element }) => {
        if (!(this.header().nativeElement as HTMLElement).contains(element)) {
          this.displayActions.set(false);
        }
      });
  }

  protected activateActions(): void {
    if (this.isEditable()) {
      this.displayActions.set(true);
    }
  }
}
