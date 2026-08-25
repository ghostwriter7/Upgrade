import { inject, Pipe, PipeTransform } from '@angular/core';
import { SkillStore } from '@store/skill.store';

@Pipe({
  name: 'skillName',
})
export class SkillNamePipe implements PipeTransform {
  private readonly skillStore = inject(SkillStore);

  public transform(skillId: string): string {
    return this.skillStore.skillsById()[skillId]?.name ?? 'Unknown Skill';
  }
}
