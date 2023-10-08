import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login', loadComponent: () => import('./pages/login/login.component')
    },
    {
        path: 'register', loadComponent: () => import('./pages/register/register.component')
    },
    {
        path: 'reset-password', loadComponent: () => import('./pages/forgot-pass/forgot-pass.component')
    },
    {
        path: 'home', loadComponent: () => import('./pages/home/home.component')
    },
    {
        path: 'reset/:token', loadComponent: () => import('./pages/reset/reset.component')
    },
];
