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
import { ExerciseNamePipe } from '../../../ui/pipes/exercise-name-pipe';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMiniFabButton } from '@angular/material/button';
import { SetView } from '../set-view/set-view';
import { ExerciseLog } from '../../../domain/model/session.model';
import { EventService } from '../../../common/service/event/event.service';
import { ElementClickedEvent } from '../../../common/events/element-clicked.event';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EntryDetails } from '../entry-details/entry-details';
import { ExerciseCardActions } from '../exercise-card-actions/exercise-card-actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-exercise-card',
  imports: [
    ExerciseNamePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatMiniFabButton,
    SetView,
    ExerciseCardActions,
  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.css',
})
export class ExerciseCard {
  public isEditable = input(false);
  public entry = input.required<ExerciseLog>();
  public isNonDeletable = input.required<boolean>();

  protected readonly testIds = computed(() => {
    const uuid = this.entry().exerciseId;
    return {
      exerciseCardHeader: `exercise-card-header-${uuid}`,
    };
  });

  protected readonly displayActions = signal(false);
  private readonly header = viewChild.required(MatCardHeader, { read: ElementRef });
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hasMedia = computed(() => this.entry().mediaIds.length);

  private readonly bottomSheetService = inject(MatBottomSheet);

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

  protected showMedia(): void {
    this.bottomSheetService.open(EntryDetails, {
      data: { exerciseLog: this.entry() },
      height: '80svh',
    });
  }
}
