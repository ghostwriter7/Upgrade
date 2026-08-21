import { Component, inject } from '@angular/core';
import { SkillStore } from '@store/skill.store';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-skill-session-selector',
  imports: [MatButton],
  templateUrl: './skill-session-selector.html',
  styleUrl: './skill-session-selector.css',
})
export class SkillSessionSelector {
  private readonly skillStore = inject(SkillStore);

  protected readonly skills = this.skillStore.skills;
}
