import { Component, inject } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { Skill } from '@domain/model/skill';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { LibraryStore } from '@store/library.store';

@Component({
  selector: 'app-skill-session-selector',
  imports: [MatMiniFabButton, MatIcon],
  templateUrl: './skill-session-selector.html',
  styleUrl: './skill-session-selector.css',
})
export class SkillSessionSelector {
  private readonly libraryStore = inject(LibraryStore);
  private readonly router = inject(Router);

  protected readonly skills = this.libraryStore.skills;
  protected initSession(skill: Skill): void {
    this.router.navigate(['session', 'new'], { queryParams: { skill: skill.id } });
  }
}
