import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { Session } from './domain/model/session.model';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'session/new',
    data: {
      isNew: true
    },
    resolve: {
      session: () => Session.createEmpty()
    },
    loadComponent: () => import('./session/session-view/session-view'),
  },
  {
    path: 'session/:date',
    loadComponent: () => import('./session/session-page/session-page'),
  },
];
