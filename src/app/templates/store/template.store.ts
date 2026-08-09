import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
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
  withMethods((store, repository = inject(TemplateRepository)) => ({
    upsert: (template: Template): void => {
      const index = store.templates().findIndex(({ id }) => template.id === id);
      if (index !== -1) {
        patchState(store, (state) => ({
          templates: state.templates.with(index, { ...template }),
        }));
      } else {
        patchState(store, (state) => ({
          templates: [...state.templates, template].sort(comparator),
        }));
      }

      repository.save(template);
    },
  })),
  withHooks({
    onInit: (store, templateRepository = inject(TemplateRepository)) => {
      templateRepository
        .getAllTemplates()
        .then((templates) => patchState(store, { templates: templates.sort(comparator) }));
    },
  }),
);

function comparator(a: Template, b: Template): number {
  if (a.isFavourite !== b.isFavourite) return a.isFavourite ? 1 : -1;

  return a.name.localeCompare(b.name);
}
