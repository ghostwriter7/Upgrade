import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Template } from '@domain/model/template/template.model';
import { inject } from '@angular/core';
import { TemplateRepository } from '@persistence/repository/templates/template.repository';

interface State {
  edited: Template | null;
  templates: Template[];
}

const initialState: State = {
  edited: null,
  templates: [],
};

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, repository = inject(TemplateRepository)) => {
    const findIndex = (template: Template): number =>
      store.templates().findIndex(({ id }) => template.id === id);

    const update = (index: number, template: Template): void =>
      patchState(store, (state) => ({
        ...state,
        templates: state.templates.with(index, { ...template }),
      }));

    return {
      setEdited: (edited: Template | null): void => patchState(store, { edited }),

      upsert: (template: Template): void => {
        const index = findIndex(template);
        if (index !== -1) {
          update(index, template);
        } else {
          patchState(store, (state) => ({
            ...state,
            templates: [...state.templates, template].sort(comparator),
          }));
        }

        repository.save(template);
      },

      toggleFavourite: (template: Template): void => {
        const index = findIndex(template);
        if (index !== -1) {
          const updated = { ...template, isFavourite: !template.isFavourite };
          update(index, updated);
          repository.save(updated);
        }
      },

      delete: (template: Template): void => {
        patchState(store, (state) => ({
          ...state,
          templates: state.templates.filter(({ id }) => template.id !== id),
        }));
        repository.deleteById(template.id);
      },
    };
  }),
  withHooks({
    onInit: (store, templateRepository = inject(TemplateRepository)) => {
      templateRepository
        .getAllTemplates()
        .then((templates) => patchState(store, { templates: templates.sort(comparator) }));
    },
  }),
);

function comparator(a: Template, b: Template): number {
  if (a.isFavourite !== b.isFavourite) return a.isFavourite ? -1 : 1;

  return a.name.localeCompare(b.name);
}
