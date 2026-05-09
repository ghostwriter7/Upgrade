import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { SkillStore } from '../../store/skills.store';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Skill } from '../../domain/model/skill.model';
import { SkillFactory } from '../../domain/factory/skill.factory';

type SkillFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string | null>;
}>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skill-form',
  imports: [MatFormField, MatLabel, MatInput, MatButton, ReactiveFormsModule, RouterLink],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css',
})
export default class SkillForm {
  public uuid = input<string | null>(null);
  private readonly store = inject(SkillStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly form: SkillFormGroup = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string | null>(null),
  });

  private readonly existingSkill = computed(() => {
    const uuid = this.uuid();
    return uuid ? this.store.getSkillById(uuid) : null;
  });

  constructor() {
    effect(() => {
      const existingSkill = this.existingSkill();

      if (existingSkill) {
        this.form.setValue({
          name: existingSkill.name,
          description: existingSkill.description ?? null,
        });
      }
    });
  }

  protected save(): void {
    const value = this.form.value as Required<SkillFormGroup['value']>;
    const existingSkill = this.existingSkill();
    const uuid = this.uuid();

    if (existingSkill && uuid) {
      const skill = new Skill(
        uuid,
        value.name,
        value.description ?? null,
        existingSkill.createdAt,
        new Date().toISOString(),
      );
      this.store.update(skill);
    } else {
      const skill = SkillFactory.createNew(value.name, value.description);
      this.store.create(skill);
    }

    this.router.navigate(['/skills']);
  }
}
