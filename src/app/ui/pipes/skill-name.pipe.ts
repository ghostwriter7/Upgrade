import { inject, Pipe, PipeTransform } from '@angular/core';
import { LibraryStore } from '@store/library.store';

@Pipe({
  name: 'skillName',
})
export class SkillNamePipe implements PipeTransform {
  private readonly libraryStore = inject(LibraryStore);

  public transform(skillId: string): string {
    return this.libraryStore.skillsById()[skillId]?.name ?? 'Unknown Skill';
  }
}
