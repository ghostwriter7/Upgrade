import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { Session } from './domain/model/session.model';
import { SESSION } from './session/consts/session.token';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'session/new',
    data: {
      isNew: true,
    },
    providers: [{ provide: SESSION, useFactory: Session.createEmpty }],
    loadComponent: () => import('./session/session-view/session-view'),
  },
  {
    path: 'session/:date',
    loadComponent: () => import('./session/session-page/session-page'),
  },
];
