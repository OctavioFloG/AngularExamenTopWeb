// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './services/auth-guard/auth-guard';
import { KardexComponent } from './kardex/kardex';
import { HorariosComponent } from './horarios/horarios';
import { CalificacionesComponent } from './calificaciones/calificaciones';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
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
