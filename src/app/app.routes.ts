import { Routes } from '@angular/router';
import { HomePage } from '@home/components/home-page/home-page';
import { inject } from '@angular/core';
import { SessionStateHolder } from '@session/store/session-state-holder.store';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
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
    path: 'library/exercises',
    loadComponent: () => import('./library/components/exercises-page/exercises-page'),
  },
  {
    path: 'library/exercises/new',
    loadComponent: () => import('./library/components/exercise-editor/exercise-editor'),
  },
  {
    path: 'library/exercises/edit/:id',
    loadComponent: () => import('./library/components/exercise-editor/exercise-editor'),
  },
  {
    path: 'library/exercises/:id',
    loadComponent: () => import('./library/components/exercise-view/exercise-view'),
  },
  {
    path: 'library',
    loadComponent: () => import('./library/components/library-page/library-page'),
  },
  {
    path: 'habits',
    loadComponent: () => import('./habits/components/habit-page/habit-page'),
  },
  {
    path: 'more',
    loadComponent: () => import('./ui/more-page/more-page'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
