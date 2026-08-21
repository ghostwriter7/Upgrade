import { Component, inject } from '@angular/core';
import { SkillStore } from '@store/skill.store';
import { MatButton } from '@angular/material/button';
import { Skill } from '@domain/model/skill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skill-session-selector',
  imports: [MatButton],
  templateUrl: './skill-session-selector.html',
  styleUrl: './skill-session-selector.css',
})
export class SkillSessionSelector {
  private readonly skillStore = inject(SkillStore);
  private readonly router = inject(Router);

  protected readonly skills = this.skillStore.skills;
  protected initSession(skill: Skill): void {
    this.router.navigate(['session', 'new'], { queryParams: { skill: skill.id } });
  }
}
