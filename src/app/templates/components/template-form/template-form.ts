import { Component, inject, input, output, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { ExercisesControl } from '../../../form/components/exercises-control/exercises-control';
import { createNanoId } from '@common/function/create-uuid.function';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Template } from '@domain/model/template/template.model';
import { TemplateStore } from '../../store/template.store';
import { Router } from '@angular/router';

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
  public template = input<Required<Template>>({
    id: createNanoId(),
    name: '',
    description: '',
    exerciseIds: [],
    isFavourite: false,
  });
  private readonly store = inject(TemplateStore);

  private readonly model = signal(this.template());
  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
    validate(schemaPath.exerciseIds, ({ value }) => {
      if (value().length === 0) {
        return { kind: 'error', message: 'At least one exercise needs to be selected' };
      }
      return null;
    });
  });
  private readonly router = inject(Router);

  protected onSubmit(): void {
    if (!this.form().invalid()) {
      this.store.upsert(this.form().value());
      this.router.navigateByUrl('templates');
    }
  }

  protected onCancel(): void {
    this.router.navigateByUrl('templates');
  }
}
