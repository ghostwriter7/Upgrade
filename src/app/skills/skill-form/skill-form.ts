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
import { MatOption, MatSelect } from '@angular/material/select';
import { ExerciseStore } from '../../store/exercises.store';

type SkillFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string | null>;
  prerequisiteSkillIds: FormControl<string[]>;
  exerciseIds: FormControl<string[]>;
}>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skill-form',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    RouterLink,
    MatSelect,
    MatOption,
  ],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css',
})
export default class SkillForm {
  public uuid = input<string | null>(null);
  private readonly skillStore = inject(SkillStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly form: SkillFormGroup = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control<string | null>(null),
    prerequisiteSkillIds: this.fb.control<string[]>([], { nonNullable: true }),
    exerciseIds: this.fb.control<string[]>([], { nonNullable: true }),
  });
  protected readonly availableSkills = computed(() => {
    const uuid = this.uuid();
    const skills = this.skillStore.skills();
    return uuid ? skills.filter((skill) => skill.uuid !== uuid) : skills;
  });
  protected readonly exercises = this.exerciseStore.exercises;

  private readonly existingSkill = computed(() => {
    const uuid = this.uuid();
    return uuid ? this.skillStore.getSkillById(uuid) : null;
  });

  constructor() {
    effect(() => {
      const existingSkill = this.existingSkill();

      if (existingSkill) {
        this.form.setValue({
          name: existingSkill.name,
          description: existingSkill.description ?? null,
          prerequisiteSkillIds: [...existingSkill.prerequisiteSkillIds],
          exerciseIds: [...existingSkill.exerciseIds],
        });
      }
    });
  }

  protected save(): void {
    const { name, description, exerciseIds, prerequisiteSkillIds } = this.form.value as Required<
      SkillFormGroup['value']
    >;
    const existingSkill = this.existingSkill();
    const uuid = this.uuid();

    if (existingSkill && uuid) {
      const skill = Skill.builder()
        .withName(name)
        .withDescription(description)
        .withUuid(uuid)
        .withCreatedAt(existingSkill.createdAt)
        .withUpdatedAt(new Date().toISOString())
        .withExerciseIds(exerciseIds)
        .withPrerequisiteSkillIds(prerequisiteSkillIds)
        .build();
      this.skillStore.update(skill);
    } else {
      const skill = SkillFactory.createNew(name, description, exerciseIds, prerequisiteSkillIds);
      this.skillStore.create(skill);
    }

    this.router.navigate(['/skills']);
  }
}
