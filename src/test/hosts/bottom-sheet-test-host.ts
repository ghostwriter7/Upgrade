import { MatDialogModule } from '@angular/material/dialog';
import { Component, inject, Type } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  template: '',
})
export class BottomSheetTestHost {
  private readonly bottomSheet = inject(MatBottomSheet);

  public openSheet<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: MatBottomSheetConfig<TData>,
  ): void {
    this.bottomSheet.open(component, config);
  }
}
