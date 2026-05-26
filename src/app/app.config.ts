import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { DATABASE_TOKEN } from './persistence/repository/database.token';
import { databaseFactory } from './persistence/repository/database-initializer.service';
import { provideServiceWorker } from '@angular/service-worker';
import { CommandHandlerProvider } from './session/commands/handlers/command-handler.provider';
import { EventHandlerProvider } from './session/events/handlers/event-handler.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: DATABASE_TOKEN, useFactory: databaseFactory },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ...CommandHandlerProvider.forRoot(),
    ...EventHandlerProvider.forRoot(),
  ],
};
