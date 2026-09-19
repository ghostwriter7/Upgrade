import { Component, inject } from '@angular/core';
import { SkillList } from '@skill/components/skill-list/skill-list';
import { SkillStore } from '@store/skill.store';
import { MatFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

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
  private readonly skillStore = inject(SkillStore);

  protected readonly skills = this.skillStore.skills;
}
