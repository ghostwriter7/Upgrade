import { Component, effect, inject, input, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { LibraryStore } from '@store/library.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatFabButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skill-form',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatDivider,
    FormField,
    MatSelectionList,
    MatListOption,
    MatFabButton,
    MatIcon,
  ],
  templateUrl: './skill-form.html',
  styleUrl: './skill-form.css',
  host: {
    class: 'page',
  },
})
export default class SkillForm {
  public readonly skillId = input<string>();

  private readonly libraryStore = inject(LibraryStore);
  private readonly router = inject(Router);

  protected readonly model = signal<{
    name: string;
    drillIds: string[];
  }>({
    name: '',
    drillIds: [],
  });

  protected readonly form = form(this.model, (schemaPath) => {
    minLength(schemaPath.drillIds, 1);
    required(schemaPath.name);
  });

  protected readonly drills = this.libraryStore.exercises;

  constructor() {
    effect(() => {
      const skillId = this.skillId();

      if (skillId) {
        const skill = this.libraryStore.skillsById()[skillId];

        this.model.set({
          name: skill.name,
          drillIds:
            this.libraryStore
              .exerciseBySkillId()
              .get(skillId)
              ?.map((exercise) => exercise.id) ?? [],
        });
      }
    });
  }

  protected save(): void {
    if (this.form().invalid()) return;

    const { name, drillIds } = this.form().value();

    const skill = {
      name,
      id: this.skillId() ?? createNanoId(),
      exerciseIds: drillIds,
    };

    if (this.skillId()) {
      this.libraryStore.updateSkill(skill);
    } else {
      this.libraryStore.saveSkill(skill);
    }

    this.router.navigate(['/skills', skill.id]);
  }
}
