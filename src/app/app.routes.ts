import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'session/new',
    loadComponent: () => import('./session/session-view/session-view'),
  },
  {
    path: 'session/:date',
    loadComponent: () => import('./session/session-page/session-page'),
  },
];
