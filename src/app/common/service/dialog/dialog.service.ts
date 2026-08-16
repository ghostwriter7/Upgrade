import { DestroyRef, inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Alert } from '@ui/alert/alert';

@Injectable()
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public open<R, D, T>(
    component: Type<T>,
    afterClosedHandler: (result: R) => void,
    config: MatDialogConfig<D> = {},
    valuePredicate: (result: R) => boolean = Boolean,
  ): void {
    const dialogRef = this.dialog.open(component, config);
    dialogRef
      .afterClosed()
      .pipe(filter(valuePredicate), takeUntilDestroyed(this.destroyRef))
      .subscribe(afterClosedHandler);
  }

  public alert(message: string): void {
    this.dialog.open(Alert, { data: { message } });
  }
}
