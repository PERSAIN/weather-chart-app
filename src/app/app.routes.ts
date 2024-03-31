import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
  },
  {
    path: 'weather/:station',
    loadComponent: () =>
      import('./components/weather-chart/weather-chart.component'),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
