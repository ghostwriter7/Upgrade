import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { DateHelper } from '../../../common/helper/date.helper';
import { pad } from '../../../common/function/pad-time.function';

@Component({
  selector: 'app-edit-time',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    FormField,
  ],
  templateUrl: './edit-time.html',
  styleUrl: './edit-time.css',
})
export class EditTime {
  protected readonly data: { label: string; instant: TemporalType.Instant } =
    inject(MAT_DIALOG_DATA);
  protected readonly form: FieldTree<{ time: string }>;

  protected readonly result = computed(() => {
    const time = this.form.time().value();
    const [hour, minute] = time.split(':').map(Number);

    const initialInstant = this.data.instant;

    return DateHelper.toLocal(initialInstant).with({
      minute, hour
    }).toInstant();
  })

  constructor() {
    const { hour, minute } = DateHelper.toLocal(this.data.instant);
    this.form = form(
      signal({ time: `${pad(hour)}:${pad(minute)}` }),
    );
  }
}
