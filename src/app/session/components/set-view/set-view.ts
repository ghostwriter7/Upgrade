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
import {
  ExerciseSet,
} from '@domain/model/exercise-set/exercise-set.model';
import { EventService } from '@common/service/event/event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ElementClickedEvent } from '@common/events/element-clicked.event';
import { SetActions } from '../set-actions/set-actions';
import { formatSet } from '@domain/model/exercise-set/format-set';

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
  protected readonly displayValue = computed(() => formatSet(this.set()));

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
