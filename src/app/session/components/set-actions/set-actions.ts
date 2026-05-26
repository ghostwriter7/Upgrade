import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { DialogService } from '../../../common/service/dialog/dialog.service';
import { CommandBus } from '../../routers/command-bus';
import { SetData } from '../set-form/set-data.interface';
import { UpsertSet } from '../upsert-set/upsert-set.component';
import { SetDataMapper } from '../set-form/mapper/set-data.mapper';
import { UpdateSetCommand } from '../../commands/update-set.command';
import { UpsertSetDialogData } from '../upsert-set/upsert-set-dialog-data.interface';
import { DeleteSetCommand } from '../../commands/delete-set.command';
import { CopySetCommand } from '../../commands/copy-set.command';
import { ExerciseSet } from '../../../domain/model/exercise-set.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-set-actions',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './set-actions.html',
  styleUrl: './set-actions.css',
})
export class SetActions {
  public set = input.required<ExerciseSet>();
  public setDelete = output<void>();

  private readonly dialogService = inject(DialogService);
  private readonly commandBus = inject(CommandBus);

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
      { data: { set: SetDataMapper.toDto(set) } as UpsertSetDialogData },
    );
  }

  protected deleteSet(event: Event): void {
    event.stopPropagation();
    this.setDelete.emit();
    this.commandBus.dispatch(new DeleteSetCommand(this.set()));
  }

  protected copySet(event: Event): void {
    event.stopPropagation();
    this.commandBus.dispatch(new CopySetCommand(this.set()));
  }
}
