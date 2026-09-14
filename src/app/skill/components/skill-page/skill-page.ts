import { Component, inject } from '@angular/core';
import { SkillList } from '@skill/components/skill-list/skill-list';
import { SkillStore } from '@store/skill.store';

@Component({
  selector: 'app-skill-page',
  imports: [SkillList],
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
