import { patchState, signalStore, withComputed, withHooks, withState } from '@ngrx/signals';
import { Skill } from '@domain/model/skill';
import { CapabilityDefinition } from '@domain/model/capability-definition';
import { computed, inject } from '@angular/core';
import { Database } from '@infrastructure/database';
import {
  CapabilitySchema,
  SkillCapabilitySchema,
  SkillSchema,
} from '@persistence/schema/skill.schema';

interface State {
  skills: Skill[];
  capabilities: CapabilityDefinition[];
}

const initialState: State = {
  skills: [],
  capabilities: [],
};

export const SkillStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    skillsById: computed(() =>
      store
        .skills()
        .reduce((index, skill) => ({ ...index, [skill.id]: skill }), {} as Record<string, Skill>),
    ),
  })),
  withHooks((store, database = inject(Database)) => ({
    onInit: async () => {
      const [capabilities, skills, skillCapabilities] = await Promise.all([
        database.queryMany(`select id, name from capability`),
        database.queryMany(`select id, name from skill`),
        database.queryMany(
          `select skill_id as skillId, capability_id as capabilityId, importance from skill_capability`,
        ),
      ]);

      const capabilityIndex = capabilities
        .map((capability) => CapabilitySchema.parse(capability))
        .reduce(
          (lookup, capability) => {
            lookup[capability.id] = capability;
            return lookup;
          },
          {} as Record<string, CapabilityDefinition>,
        );

      const capabilitiesBySkillId = Object.groupBy(
        skillCapabilities.map((sc) => {
          const skillCapability = SkillCapabilitySchema.parse(sc);
          return { ...skillCapability, label: capabilityIndex[skillCapability.capabilityId].name };
        }),
        (sc) => sc.skillId,
      );

      patchState(store, (state) => ({
        ...state,
        capabilities: capabilities.map((capability) => CapabilitySchema.parse(capability)),
        skills: skills
          .map((result) => {
            const skill = SkillSchema.parse(result);
            return {
              ...skill,
              capabilities:
                capabilitiesBySkillId[skill.id]?.toSorted((a, b) => b.importance - a.importance) ??
                [],
            };
          })
          .toSorted((a, b) => a.name.localeCompare(b.name)),
      }));
    },
  })),
);
