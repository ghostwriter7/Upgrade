import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { DATABASE_TOKEN } from './persistence/repository/database.token';
import { databaseFactory } from './persistence/repository/database-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: DATABASE_TOKEN, useFactory: databaseFactory }
  ],
};
