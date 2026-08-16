import { computed, inject, Service } from '@angular/core';
import { TemplateStore } from './store/template.store';
import { Session } from '@domain/model/session/session.model';
import { createNanoId } from '@common/function/create-uuid.function';
import { RateOfPerceivedEffortValue } from '@domain/enum/rate-of-perceived-effort-value';
import { Router } from '@angular/router';

@Service()
export class TemplateFacade {
  private readonly templateStore = inject(TemplateStore);

  public readonly $templates = this.templateStore.templates;

  public readonly $templatesByRPE = computed(() =>
    Object.groupBy(this.$templates(), (template) => template.rpe),
  );
  private readonly router = inject(Router);

  public initNewTemplateFromSession({ exerciseIds }: Session): void {
    if (this.templateExistsFor(exerciseIds)) {
      throw new Error(`Template matching this session's exercises exists.`);
    }

    const template = {
      id: createNanoId(),
      name: '',
      description: '',
      exerciseIds,
      isFavourite: false,
      rpe: RateOfPerceivedEffortValue.Mid,
    };
    this.templateStore.setEdited(template);
    this.router.navigateByUrl('templates/edit');
  }

  private templateExistsFor(expectedExerciseIds: string[]): boolean {
    const expectedLength = expectedExerciseIds.length;
    return this.$templates().some(
      ({ exerciseIds }) =>
        exerciseIds.length === expectedLength &&
        expectedExerciseIds.every((id) => exerciseIds.includes(id)),
    );
  }
}
