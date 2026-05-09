import { Component, effect, inject, input } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { SkillStore } from '../../store/skills.store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Skill } from '../../model/skill.model';
import { createUuid } from '../../common/function/create-uuid.function';

type SkillFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string | null>;
}>;

@Component({
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

  constructor() {
    effect(() => {
      const uuid = this.uuid();

      if (uuid) {
        const skill = this.store.getSkillById(uuid);

        if (!skill) throw new Error('Skill not found');
        this.form.setValue({
          name: skill.name,
          description: skill.description ?? null,
        });
      }
    });
  }

  protected save(): void {
    const value = this.form.value as Required<SkillFormGroup['value']>;
    const isExisting = !!this.uuid();

    const skill: Skill = {
      uuid: this.uuid() ?? createUuid(),
      name: value.name,
      description: value.description ?? null,
    }

    if (isExisting) {
      this.store.update(skill);
    } else {
      this.store.create(skill);
    }

    this.router.navigate(['/skills']);
  }
}
