import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ExerciseSet, IsoSet, WeightedSet } from '../../../domain/model/exercise-set.model';
import { EventService } from '../../../common/service/event/event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ElementClickedEvent } from '../../../common/events/element-clicked.event';
import { SetActions } from '../set-actions/set-actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-set-view',
  imports: [SetActions],
  templateUrl: './set-view.html',
  styleUrl: './set-view.css',
})
export class SetView {
  public isEditable = input(false);
  public set = input.required<ExerciseSet>();

  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayActions = signal(false);
  protected readonly displayValue = computed(() => {
    const set = this.set();
    switch (set.type) {
      case 'bodyweight':
        return `${set.quantity} reps`;
      case 'weight': {
        const weightSet = set as WeightedSet;
        return `${weightSet.quantity} reps + ${weightSet.weight} kg`;
      }
      case 'iso': {
        const isoSet = set as IsoSet;
        if (isoSet.weight) {
          return `${isoSet.quantity} seconds + ${isoSet.weight} kg`;
        }
        return `${isoSet.quantity} seconds`;
      }
    }
  });

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this.eventService
      .listen(ElementClickedEvent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (!(this.elementRef.nativeElement as HTMLElement).contains(payload.element)) {
          this.displayActions.set(false);
        }
      });
  }

  protected activateActions(): void {
    if (this.isEditable()) {
      this.displayActions.set(true);
    }
  }

  protected onSetDeleted(): void {
    this.displayActions.set(false);
  }
}
