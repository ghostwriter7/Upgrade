import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Component, inject, Type } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  template: '',
})
export class DialogTestHostComponent {
  private readonly dialog = inject(MatDialog);

  public openDialog<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: MatDialogConfig<TData>,
  ): Promise<TResult | undefined> {
    const dialogRef = this.dialog.open<TComponent, TData, TResult>(component, config);

    return firstValueFrom(dialogRef.afterClosed());
  }
}
