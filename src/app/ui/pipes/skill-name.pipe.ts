import { inject, Pipe, PipeTransform } from '@angular/core';
import { ExerciseStore } from '@store/exercises.store';

@Pipe({
  name: 'skillName',
})
export class SkillNamePipe implements PipeTransform {
  private readonly exerciseStore = inject(ExerciseStore);

  public transform(skillId: string): string {
    return this.exerciseStore.skillsById()[skillId]?.name ?? 'Unknown Skill';
  }
}
