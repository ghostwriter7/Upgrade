import { Component, inject, input } from '@angular/core';
import { Skill } from '@domain/model/skill';
import { MatActionList, MatListItem } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skill-list',
  imports: [MatListItem, MatActionList],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.css',
})
export class SkillList {
  public readonly skills = input.required<Skill[]>();

  private readonly router = inject(Router);

  protected showDetails(skill: Skill): void {
    this.router.navigate(['skills', skill.id]);
  }
}
