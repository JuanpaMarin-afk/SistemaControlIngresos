// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { AuthGuard } from './demo/authentication/login/authGuard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-income-page',
        loadComponent: () => import('./demo/other/consult-income-page/consult-income-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'create-project-page',
        loadComponent: () => import('./demo/other/create-project-page/create-project-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-project-page',
        loadComponent: () => import('./demo/other/consult-project-page/consult-project-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-client-page',
        loadComponent: () => import('./demo/other/consult-client-page/consult-client-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-client-type-page',
        loadComponent: () => import('./demo/other/consult-client-type-page/consult-client-type-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-client-page',
        loadComponent: () => import('./demo/other/consult-client-page/consult-client-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-attendant-page',
        loadComponent: () => import('./demo/other/consult-attendant-page/consult-attendant-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-logs',
        loadComponent: () => import('./demo/other/consult-logs/consult-logs.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-typework',
        loadComponent: () => import('./demo/other/consult-typework/consult-typework.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'consult-users',
        loadComponent: () => import('./demo/other/consult-users/consult-users.component'),
        canActivate: [AuthGuard]
      },

    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
