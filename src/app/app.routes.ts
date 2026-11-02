import { Routes } from '@angular/router';

import { PolicyManagement } from './features/policy-management/policy-management';
import { ClaimsSubmission } from './features/claims-submission/claims-submission';
import { ClaimsReview } from './features/claims-review/claims-review';
import { RiskAdmin } from './features/risk-admin/risk-admin';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'policies',
    pathMatch: 'full',
  },
  {
    path: 'policies',
    component: PolicyManagement,
  },
  {
    path: 'claims/submit',
    component: ClaimsSubmission,
  },
  {
    path: 'claims/review',
    component: ClaimsReview,
  },
  {
    path: 'risk',
    component: RiskAdmin,
  },
  {
    path: '**',
    redirectTo: 'policies',
  },
];