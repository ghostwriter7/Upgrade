import { Migrations } from '@persistence/migrations/migration.interface';
import { CreateMediaAndMeasurementsMigration } from '@persistence/migrations/create-media-and-measurements/create-media-and-measurements';
import { CreateBaseStoresMigration } from '@persistence/migrations/create-base-stores/create-base-stores';
import {
  CreateSetBySessionIdAndExerciseIdIndexMigration
} from '@persistence/migrations/create-set-by-session-id-and-exercise-id-index/create-set-by-session-id-and-exercise-id-index';
import { InjectionToken } from '@angular/core';

export const CHANGELOG: Migrations = {
  1: new CreateBaseStoresMigration(),
  5: new CreateSetBySessionIdAndExerciseIdIndexMigration(),
  9: new CreateMediaAndMeasurementsMigration()
};

export const CHANGELOG_TOKEN = new InjectionToken<Migrations>('CHANGELOG');
