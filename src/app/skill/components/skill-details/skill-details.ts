import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Loader } from '@ui/loader/loader';
import { MatDivider } from '@angular/material/list';
import { ExerciseStore } from '@store/exercises.store';

@Component({
  selector: 'app-skill-details',
  imports: [MatCard, MatCardTitle, MatCardHeader, Loader, MatCardContent, MatDivider],
  templateUrl: './skill-details.html',
  styleUrl: './skill-details.css',
  host: {
    class: 'page',
  },
})
export default class SkillDetails {
  public skillId = input.required<string>();

  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly skill = computed(() => this.exerciseStore.skillsById()[this.skillId()]);
}
