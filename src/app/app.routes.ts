import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/skills-page/skills-page'),
  },
  { path: 'skills/new', loadComponent: () => import('./skills/skill-form/skill-form') },
  { path: 'skills/:uuid', loadComponent: () => import('./skills/skill-form/skill-form') },
];
