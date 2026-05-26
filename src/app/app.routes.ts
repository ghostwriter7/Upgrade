import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { inject } from '@angular/core';
import { SessionStateHolder } from './session/store/session-state-holder.store';

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
    loadComponent: () => import('./session/components/session-editor/session-editor'),
  },
  {
    path: 'session/edit',
    data: {
      isNew: false,
    },
    canActivate: [() => !!inject(SessionStateHolder).session()],
    loadComponent: () => import('./session/components/session-editor/session-editor'),
  },
  {
    path: 'session/:date',
    loadComponent: () => import('./session/components/session-page/session-page'),
  },
];
