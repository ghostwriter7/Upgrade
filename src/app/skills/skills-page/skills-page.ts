import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatActionList, MatDivider, MatListItem } from '@angular/material/list';
import { SkillStore } from '../../store/skills.store';
import { RouterLink } from '@angular/router';
import { Skill } from '../../domain/model/skill.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skills-page',
  imports: [MatButton, MatDivider, MatListItem, MatActionList, RouterLink],
  templateUrl: './skills-page.html',
  styleUrl: './skills-page.css',
})
export default class SkillsPage {
  private readonly store = inject(SkillStore);

  protected readonly skills: Signal<Skill[]> = this.store.skills;
}
