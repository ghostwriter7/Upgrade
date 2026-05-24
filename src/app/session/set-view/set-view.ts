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
import { ExerciseSet, IsoSet, WeightedSet } from '../../domain/model/exercise-set.model';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { SessionEditorService } from '../services/session-editor.service';
import { EventService } from '../../common/service/event/event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ElementClickedEvent } from '../../common/events/element-clicked.event';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-set-view',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './set-view.html',
  styleUrl: './set-view.css',
})
export class SetView {
  public set = input.required<ExerciseSet>();
  public index = input.required<number>();
  public exerciseId = input.required<string>();

  private readonly sessionEditor = inject(SessionEditorService);
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isEditable = this.sessionEditor.$isEditable;
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

  protected editSet(event: Event): void {
    event.stopPropagation();
    this.sessionEditor.editSet(this.set());
  }

  protected deleteSet(event: Event): void {
    event.stopPropagation();
    this.displayActions.set(false);
    this.sessionEditor.deleteSet(this.exerciseId(), this.index(), this.set().id!);
  }

  protected copySet(event: Event): void {
    event.stopPropagation();
    this.sessionEditor.copySet(this.exerciseId(), this.index());
  }
}
