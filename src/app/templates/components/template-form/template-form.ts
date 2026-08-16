import { Component, computed, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { ExercisesControl } from '@form/components/exercises-control/exercises-control';
import { createNanoId } from '@common/function/create-uuid.function';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TemplateStore } from '../../store/template.store';
import { Router } from '@angular/router';
import {
  RateOfPerceivedEffortOptions,
  RateOfPerceivedEffortValue,
} from '@domain/enum/rate-of-perceived-effort-value';
import { MatOption, MatSelect } from '@angular/material/select';

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
    MatSelect,
    MatOption,
  ],
  templateUrl: './template-form.html',
  styleUrl: './template-form.css',
  host: {
    class: 'page',
  },
})
export default class TemplateForm {
  private readonly store = inject(TemplateStore);
  private readonly template = computed(
    () =>
      this.store.edited() ?? {
        id: createNanoId(),
        name: '',
        rpe: RateOfPerceivedEffortValue.Mid,
        description: '',
        exerciseIds: [],
        isFavourite: false,
      },
  );

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
  protected readonly rpeOptions = RateOfPerceivedEffortOptions;

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
