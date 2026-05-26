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
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { EventService } from '../../../common/service/event/event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ElementClickedEvent } from '../../../common/events/element-clicked.event';
import { CommandBus } from '../../routers/command-bus';
import { DeleteSetCommand } from '../../commands/delete-set.command';
import { CopySetCommand } from '../../commands/copy-set.command';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { UpdateSetCommand } from '../../commands/update-set.command';
import { SetDataMapper } from '../set-form/mapper/set-data.mapper';
import { SetData } from '../set-form/set-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-set-view',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './set-view.html',
  styleUrl: './set-view.css',
})
export class SetView {
  public isEditable = input(false);
  public set = input.required<ExerciseSet>();

  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly commandBus = inject(CommandBus);
  private readonly dialogService = inject(DialogService);

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
    const set = this.set();
    this.dialogService.open(
      UpsertSet,
      (setData: SetData) => {
        const updatedSet = SetDataMapper.toDomain(
          setData,
          set.exerciseId,
          set.sessionId,
          set.index,
        );
        updatedSet.id = this.set().id;
        this.commandBus.dispatch(new UpdateSetCommand(updatedSet));
      },
      { data: { set: SetDataMapper.toDto(set) } },
    );
  }

  protected deleteSet(event: Event): void {
    event.stopPropagation();
    this.displayActions.set(false);
    this.commandBus.dispatch(new DeleteSetCommand(this.set()));
  }

  protected copySet(event: Event): void {
    event.stopPropagation();
    this.commandBus.dispatch(new CopySetCommand(this.set()));
  }
}
