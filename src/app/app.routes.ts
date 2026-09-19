import { Routes } from '@angular/router';
import { HomePage } from '@home/components/home-page/home-page';
import { inject } from '@angular/core';
import { SessionStateHolder } from '@session/store/session-state-holder.store';

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
  {
    path: 'backup',
    loadComponent: () => import('./backup/components/backup-page/backup-page'),
  },
  {
    path: 'exercises',
    loadComponent: () => import('./exercises/components/exercises-page/exercises-page'),
  },
  {
    path: 'exercises/new',
    loadComponent: () => import('./exercises/components/exercise-editor/exercise-editor'),
  },
  {
    path: 'exercises/edit/:id',
    loadComponent: () => import('./exercises/components/exercise-editor/exercise-editor'),
  },
  {
    path: 'exercises/:id',
    loadComponent: () => import('./exercises/components/exercise-view/exercise-view'),
  },
  {
    path: 'targets',
    loadComponent: () => import('./target/components/target-page/target-page'),
  },
  {
    path: 'skills',
    loadComponent: () => import('./skill/components/skill-page/skill-page'),
  },
  {
    path: 'skills/new',
    loadComponent: () => import('./skill/components/skill-form/skill-form'),
  },
  {
    path: 'skills/:skillId',
    loadComponent: () => import('./skill/components/skill-details/skill-details'),
  },
];
