import { Component, computed, inject, input } from '@angular/core';
import { SkillStore } from '@store/skill.store';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Loader } from '@ui/loader/loader';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { Lozenge } from '@ui/lozenge/lozenge';

@Component({
  selector: 'app-skill-details',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    Loader,
    MatCardContent,
    MatDivider,
    MatList,
    MatListItem,
    Lozenge,
  ],
  templateUrl: './skill-details.html',
  styleUrl: './skill-details.css',
  host: {
    class: 'page',
  },
})
export default class SkillDetails {
  public skillId = input.required<string>();

  private readonly skillStore = inject(SkillStore);

  protected readonly skill = computed(() => this.skillStore.skillsById()[this.skillId()]);
}
