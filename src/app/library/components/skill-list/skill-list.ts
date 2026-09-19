import { Component, computed, inject, input } from '@angular/core';
import { Skill } from '@domain/model/skill';
import {
  MatActionList,
  MatDivider,
  MatListItem,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

interface GroupedSkills {
  favourite: Skill[];
  regular: Skill[];
}

@Component({
  selector: 'app-skill-list',
  imports: [MatListItem, MatActionList, MatListSubheaderCssMatStyler, MatIcon, MatDivider],
  templateUrl: './skill-list.html',
  styleUrl: './skill-list.css',
})
export class SkillList {
  public readonly skills = input.required<GroupedSkills, Skill[]>({
    transform: (skills) =>
      skills.reduce(
        (lookup, skill) => {
          lookup[skill.isFavourite ? 'favourite' : 'regular'].push(skill);
          return lookup;
        },
        { favourite: [], regular: [] } as GroupedSkills,
      ),
  });

  private readonly router = inject(Router);
  protected readonly hasNoSkills = computed(() => {
    const { regular, favourite } = this.skills();
    return !regular.length && !favourite.length;
  });

  protected showDetails(skill: Skill): void {
    this.router.navigate(['skills', skill.id]);
  }
}
