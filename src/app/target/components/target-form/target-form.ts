import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  form,
  FormField,
  max,
  maxLength,
  min,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SkillStore } from '@store/skill.store';
import { MatDivider } from '@angular/material/list';
import { Motivation, Target, TargetPriority, TargetStatus } from '@domain/model/target';
import { TargetResult } from './target-result';
import { PriorityOptions } from '../../consts/priority-options';
import { StatusOptions } from '../../consts/status-options';

interface StatementFormValue {
  statement: string;
}

interface TargetFormValue {
  name: string;
  description: string;

  skillId: string | null;

  priority: TargetPriority;
  status: TargetStatus;

  targetDate: Date | null;

  motivation: StatementFormValue[];
  tradeOffs: StatementFormValue[];

  weeklyCommitmentInMinutes: number;
}

@Component({
  selector: 'app-target-form',
  imports: [
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    FormField,
    FormsModule,
    MatDivider,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './target-form.html',
  styleUrl: './target-form.css',
})
export class TargetForm {
  public readonly target = input<Target | null>(null);

  public readonly saved = output<TargetResult>();
  public readonly cancelled = output<void>();

  protected readonly priorityOptions = PriorityOptions;
  protected readonly statusOptions = StatusOptions;

  private readonly skillStore = inject(SkillStore);
  protected readonly skillOptions = computed(() =>
    this.skillStore.skills().map((skill) => ({
      value: skill.id,
      label: skill.name,
    })),
  );
  private readonly model = signal<TargetFormValue>(this.createInitialFormValue());

  protected readonly form = form(this.model, (path) => {
    required(path.name);
    maxLength(path.name, 120);

    maxLength(path.description, 1000);

    required(path.skillId);

    required(path.status);

    required(path.weeklyCommitmentInMinutes);
    min(path.weeklyCommitmentInMinutes, 0);
    max(path.weeklyCommitmentInMinutes, 10080);

    validate(path.motivation, ({ value }) => {
      const invalidIndex = value().findIndex((item) => item.statement.trim().length === 0);

      if (invalidIndex === -1) {
        return null;
      }

      return {
        kind: 'emptyMotivation',
        message: 'Motivation is required',
      };
    });

    validate(path.tradeOffs, ({ value }) => {
      const invalidIndex = value().findIndex((item) => item.statement.trim().length === 0);

      if (invalidIndex === -1) {
        return null;
      }

      return {
        kind: 'emptyTradeOff',
        message: 'Trade-off is required',
      };
    });
  });
  protected readonly hasOneMotivationOnly = computed(() => this.model().motivation.length <= 1);
  protected readonly hasOneTradeOffOnly = computed(() => this.model().tradeOffs.length <= 1);

  constructor() {
    effect(() => {
      const target = this.target();

      if (!target) {
        return;
      }

      this.model.set(this.targetToFormValue(target));
    });
  }

  protected addMotivation(): void {
    this.model.update((value) => ({
      ...value,
      motivation: [...value.motivation, { statement: '' }],
    }));
  }

  protected removeMotivation(index: number): void {
    this.model.update((value) => {
      const motivation = value.motivation.toSpliced(index, 1);
      return { ...value, motivation: motivation.length > 0 ? motivation : [{ statement: '' }] };
    });
  }

  protected addTradeOff(): void {
    this.model.update((value) => ({
      ...value,
      tradeOffs: [...value.tradeOffs, { statement: '' }],
    }));
  }

  protected removeTradeOff(index: number): void {
    this.model.update((value) => {
      const tradeOffs = value.tradeOffs.toSpliced(index, 1);
      return { ...value, tradeOffs: tradeOffs.length > 0 ? tradeOffs : [{ statement: '' }] };
    });
  }

  protected onSubmit(): void {
    submit(this.form, async () => {
      if (this.form().invalid()) {
        return;
      }

      const value = this.model();

      const skillId = value.skillId;
      if (!skillId) {
        return;
      }

      this.saved.emit({
        name: value.name.trim(),
        description: this.optionalString(value.description),

        skillId,

        priority: value.priority,
        status: value.status,

        targetDate: this.toPlainDate(value.targetDate),

        motivation: this.toStatements(value.motivation),
        tradeOffs: this.toStatements(value.tradeOffs),

        weeklyCommitmentInMinutes: value.weeklyCommitmentInMinutes,
      });
    });
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }

  private createInitialFormValue(): TargetFormValue {
    return {
      name: '',
      description: '',

      skillId: null,

      priority: 'unprioritized',
      status: 'reviewing',

      targetDate: null,

      motivation: [{ statement: '' }],
      tradeOffs: [{ statement: '' }],

      weeklyCommitmentInMinutes: 60,
    };
  }

  private targetToFormValue(target: Target): TargetFormValue {
    return {
      name: target.name,
      description: target.description ?? '',

      skillId: target.skillId,

      priority: target.priority,
      status: target.status,

      targetDate: /* target.targetDate  ?? */ null,

      motivation: target.motivation.length > 0 ? target.motivation : [{ statement: '' }],
      tradeOffs: target.tradeOffs.length > 0 ? target.tradeOffs : [{ statement: '' }],

      weeklyCommitmentInMinutes: target.weeklyCommitmentInMinutes,
    };
  }

  private optionalString(value: string): string | undefined {
    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  }

  private toStatements(values: StatementFormValue[]): Motivation[] {
    return values
      .map((value) => ({ statement: value.statement.trim() }))
      .filter((value) => value.statement.length > 0);
  }

  private toPlainDate(targetDate: Date | null): Temporal.Instant | undefined {
    if (!targetDate) return undefined;

    return targetDate.toTemporalInstant();
  }
}
