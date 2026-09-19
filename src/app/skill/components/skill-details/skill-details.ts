import { Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Loader } from '@ui/loader/loader';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { LibraryStore } from '@store/library.store';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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
    MatFabButton,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './skill-details.html',
  styleUrl: './skill-details.css',
  host: {
    class: 'page',
  },
})
export default class SkillDetails {
  public skillId = input.required<string>();

  private readonly libraryStore = inject(LibraryStore);

  protected readonly skill = computed(() => this.libraryStore.skillsById()[this.skillId()]);
  protected readonly exercises = computed(
    () => this.libraryStore.exerciseBySkillId().get(this.skillId()) ?? [],
  );
}
