import type { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
