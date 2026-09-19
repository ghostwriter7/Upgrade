import { Component, inject } from '@angular/core';
import { SkillList } from '@skill/components/skill-list/skill-list';
import { MatFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ExerciseStore } from '@store/exercises.store';

@Component({
  selector: 'app-skill-page',
  imports: [SkillList, RouterLink, MatFabButton, MatIcon],
  templateUrl: './skill-page.html',
  styleUrl: './skill-page.css',
  host: {
    class: 'page',
  },
})
export default class SkillPage {
  private readonly exerciseStore = inject(ExerciseStore);

  protected readonly skills = this.exerciseStore.skills;
}
