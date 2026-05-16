import { DestroyRef, inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Injectable()
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public open<R, D, T>(
    component: Type<T>,
    afterClosedHandler: (result: R) => void,
    config?: MatDialogConfig<D>,
  ): void {
    const dialogRef = this.dialog.open(component, config);
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(afterClosedHandler);
  }
}
