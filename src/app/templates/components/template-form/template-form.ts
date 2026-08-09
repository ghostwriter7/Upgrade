import { Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { ExercisesControl } from '../../../form/components/exercises-control/exercises-control';
import { createNanoId } from '@common/function/create-uuid.function';
import { form, FormField, min, required, schema, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-template-form',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCheckbox,
    ExercisesControl,
    FormField,
    MatButton,
    FormsModule,
  ],
  templateUrl: './template-form.html',
  styleUrl: './template-form.css',
  host: {
    class: 'page',
  },
})
export default class TemplateForm {
  private readonly model = signal({
    id: createNanoId(),
    name: '',
    description: '',
    exerciseIds: [],
    isFavourite: false,
  });
  protected readonly form = form(this.model,  (schemaPath) => {
    required(schemaPath.name);
    validate(schemaPath.exerciseIds, ({ value }) => {
      if (value().length === 0) {
        return { kind: 'error', message: 'At least one exercise needs to be selected'};
      }
      return null;
    });
  });
  private readonly location = inject(Location)
  protected onSubmit(): void {
  }

  protected onCancel(): void {
    this.location.back();
  }
}
