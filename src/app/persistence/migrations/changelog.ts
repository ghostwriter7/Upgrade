import { Migrations } from '@persistence/migrations/migration.interface';
import { CreateMediaAndMeasurementsMigration } from '@persistence/migrations/create-media-and-measurements/create-media-and-measurements';
import { CreateBaseStoresMigration } from '@persistence/migrations/create-base-stores/create-base-stores';
import {
  CreateSetBySessionIdAndExerciseIdIndexMigration
} from '@persistence/migrations/create-set-by-session-id-and-exercise-id-index/create-set-by-session-id-and-exercise-id-index';
import { InjectionToken } from '@angular/core';
import {
  IndexExerciseLogByCreatedAtMigration
} from '@persistence/migrations/index-exercise-log-by-created-at/index-exercise-log-by-created-at';
import { CreateTemplateStores } from '@persistence/migrations/create-template-stores/create-template-stores';

export const CHANGELOG: Migrations = {
  1: new CreateBaseStoresMigration(),
  5: new CreateSetBySessionIdAndExerciseIdIndexMigration(),
  9: new CreateMediaAndMeasurementsMigration(),
  10: new IndexExerciseLogByCreatedAtMigration(),
  11: new CreateTemplateStores()
};

export const CHANGELOG_TOKEN = new InjectionToken<Migrations>('CHANGELOG');
