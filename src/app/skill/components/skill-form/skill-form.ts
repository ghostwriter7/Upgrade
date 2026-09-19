import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { ExerciseStore } from '@store/exercises.store';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatFabButton } from '@angular/material/button';
import { createNanoId } from '@common/function/create-id.function';
import { MatIcon } from '@angular/material/icon';

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
  private readonly exerciseStore = inject(ExerciseStore);

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

  protected readonly drills = this.exerciseStore.exercises;

  protected save(): void {
    if (this.form().invalid()) return;

    const { name, drillIds } = this.form().value();

    const skill = {
      name,
      id: createNanoId(),
    };

    this.exerciseStore.saveSkill(skill, drillIds);
  }
}
