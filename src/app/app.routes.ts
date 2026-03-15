import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },
  {
    path: 'events',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/events/event-list/event-list.component').then(m => m.EventListComponent) },
      { path: 'new', loadComponent: () => import('./features/events/event-create/event-create.component').then(m => m.EventCreateComponent) },
      { path: ':id', loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
      { path: ':id/edit', loadComponent: () => import('./features/events/event-create/event-create.component').then(m => m.EventCreateComponent) },
    ]
  },
  {
    path: 'purchase/:eventId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/purchase/ticket-purchase/ticket-purchase.component').then(m => m.TicketPurchaseComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/profile/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
      { path: 'history', loadComponent: () => import('./features/profile/event-history/event-history.component').then(m => m.EventHistoryComponent) },
      { path: 'history/:performanceId/performance', loadComponent: () => import('./features/performance/performance-detail/performance-detail.component').then(m => m.PerformanceDetailComponent) },
    ]
  },
  { path: '**', redirectTo: 'events' }
];
