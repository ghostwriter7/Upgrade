import { Component, computed, inject } from '@angular/core';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { Skill } from '@domain/model/skill';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { LibraryStore } from '@store/library.store';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-skill-session-selector',
  imports: [
    MatMiniFabButton,
    MatIcon,
    MatFabButton,
    MatButton,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  templateUrl: './skill-session-selector.html',
  styleUrl: './skill-session-selector.css',
  host: {
    class: 'flex-column',
  },
})
export class SkillSessionSelector {
  private readonly libraryStore = inject(LibraryStore);
  private readonly router = inject(Router);

  protected readonly skills = this.libraryStore.skills;

  protected readonly favouriteSkills = computed(() =>
    this.libraryStore.skills().filter((skill) => skill.isFavourite),
  );
  protected readonly remainingSkills = computed(() =>
    this.libraryStore.skills().filter((skill) => !skill.isFavourite),
  );
  protected readonly hasRemainingSkills = computed(() => this.remainingSkills().length > 0);
  protected readonly hasFavouriteSkills = computed(() => this.favouriteSkills().length > 0);

  protected initSession(skill: Skill): void {
    this.router.navigate(['session', 'new'], { queryParams: { skill: skill.id } });
  }
}
