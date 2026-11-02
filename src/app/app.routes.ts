import { Routes } from '@angular/router';
import { RiskAdmin } from './features/risk-admin/risk-admin';

export const routes: Routes = [
  {
    path: 'risk-admin',
    component: RiskAdmin
  },
  {
    path: '',
    redirectTo: 'risk-admin',
    pathMatch: 'full'
  }
];