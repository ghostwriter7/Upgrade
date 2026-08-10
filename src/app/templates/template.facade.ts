import { inject, Service } from '@angular/core';
import { TemplateStore } from './store/template.store';

@Service()
export class TemplateFacade {
  private readonly templateStore = inject(TemplateStore);

  public readonly $templates = this.templateStore.templates;
}
