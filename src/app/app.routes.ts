import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'session',
    loadComponent: () => import('./session/session-page/session-page'),
  },
  {
    path: 'session/new',
    loadComponent: () => import('./session/session-view/session-view'),
  },
  { path: 'skills', loadComponent: () => import('./skills/skills-page/skills-page') },
  { path: 'skills/new', loadComponent: () => import('./skills/skill-form/skill-form') },
  { path: 'skills/:uuid', loadComponent: () => import('./skills/skill-form/skill-form') },
  { path: 'exercises', loadComponent: () => import('./exercises/exercises-page/exercises-page') },
  { path: 'exercises/new', loadComponent: () => import('./exercises/exercise-form/exercise-form') },
  {
    path: 'exercises/:uuid',
    loadComponent: () => import('./exercises/exercise-form/exercise-form'),
  },
];
