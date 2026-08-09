import { patchState, signalStore, withHooks, withState } from '@ngrx/signals';
import { Template } from '@domain/model/template/template.model';
import { inject } from '@angular/core';
import { TemplateRepository } from '@persistence/repository/templates/template.repository';

interface State {
  templates: Template[];
}

const initialState: State = {
  templates: [],
};

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit: (store, templateRepository = inject(TemplateRepository)) => {
      templateRepository.getAllTemplates().then((templates) => patchState(store, { templates }));
    },
  }),
);
