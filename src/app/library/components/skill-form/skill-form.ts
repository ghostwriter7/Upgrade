import { Component, effect, inject, input, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { LibraryStore } from '@store/library.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatFabButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';

interface SkillModel {
  name: string;
  exerciseIds: string[];
  isFavourite: boolean;
}

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
    MatCheckbox,
    RouterLink,
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

  protected readonly model = signal<SkillModel>({
    name: '',
    exerciseIds: [],
    isFavourite: false,
  });

  protected readonly form = form(this.model, (schemaPath) => {
    required(schemaPath.name);
  });

  protected readonly exercises = this.libraryStore.exercises;

  constructor() {
    const ref = effect(() => {
      const skillId = this.skillId();

      if (skillId) {
        const skill = this.libraryStore.skillsById()[skillId];

        if (skill) {
          this.model.set({
            name: skill.name,
            exerciseIds:
              this.libraryStore
                .exerciseBySkillId()
                .get(skillId)
                ?.map((exercise) => exercise.id) ?? [],
            isFavourite: skill.isFavourite,
          });
          ref.destroy();
        }
      }
    });
  }

  protected save(): void {
    if (this.form().invalid()) return;

    const { name, exerciseIds, isFavourite } = this.form().value();

    const skill = {
      name,
      id: this.skillId() ?? createNanoId(),
      exerciseIds,
      isFavourite,
    };

    if (this.skillId()) {
      this.libraryStore.updateSkill(skill);
    } else {
      this.libraryStore.saveSkill(skill);
    }

    this.router.navigate(['/skills', skill.id]);
  }
}
