import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { DATABASE_TOKEN } from '@persistence/repository/database.token';
import { datasourceFactory } from '@persistence/datasource/datasource.factory';
import { provideServiceWorker } from '@angular/service-worker';
import { CommandHandlerProvider } from '@session/commands/command-handler.provider';
import { EventHandlerProvider } from '@session/events/event-handler.provider';
import { QueryHandlerProvider } from '@session/queries/query-handler.provider';
import { CHANGELOG, CHANGELOG_TOKEN } from '@persistence/migrations/changelog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: CHANGELOG_TOKEN, useValue: CHANGELOG },
    { provide: DATABASE_TOKEN, useFactory: () => datasourceFactory(inject(CHANGELOG_TOKEN)) },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ...CommandHandlerProvider.forRoot(),
    ...EventHandlerProvider.forRoot(),
    ...QueryHandlerProvider.forRoot(),
  ],
};
