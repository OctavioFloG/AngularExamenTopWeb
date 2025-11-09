// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './services/auth-guard/auth-guard';
import { KardexComponent } from './kardex/kardex';
import { HorariosComponent } from './horarios/horarios';
import { CalificacionesComponent } from './calificaciones/calificaciones';
import { Auth } from './services/auth/auth';

const token = localStorage.getItem('authToken');

export const routes: Routes = [
  // Para redirigir al login o al dashboard según el estado de autenticación
  { path: '', redirectTo: token ? '/dashboard' : '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'kardex', component: KardexComponent },
      { path: 'horarios', component: HorariosComponent },
      { path: 'calificaciones', component: CalificacionesComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
