import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { inject } from '@angular/core';
import { SessionStore } from './store/session/session.store';

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
    loadComponent: () => import('./session/session-view/session-view'),
  },
  {
    path: 'session/edit',
    data: {
      isNew: false,
    },
    canActivate: [() => !!inject(SessionStore).editedSession()],
    loadComponent: () => import('./session/session-view/session-view'),
  },
  {
    path: 'session/:date',
    loadComponent: () => import('./session/session-page/session-page'),
  },
];
