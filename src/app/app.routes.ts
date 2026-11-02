import { Routes } from '@angular/router';

import { PolicyManagement } from './features/policy-management/policy-management';

import { PolicyCatalogue } from './features/policy-management/components/policy-catalogue/policy-catalogue';

import { PolicyDetails } from './features/policy-management/components/policy-details/policy-details';

import { QuoteGeneration } from './features/policy-management/components/quote-generation/quote-generation';

import { CustomerProfiles } from './features/policy-management/components/customer-profiles/customer-profiles';

export const routes: Routes = [
  {
    path: 'policies',
    component: PolicyManagement,
    children: [
      {
        path: '',
        redirectTo: 'catalogue',
        pathMatch: 'full'
      },
      {
        path: 'catalogue',
        component: PolicyCatalogue
      },
      {
        path: 'quote-generation',
        component: QuoteGeneration
      },
      {
        path: 'customers',
        component: CustomerProfiles
      },
      {
        path: ':id',
        component: PolicyDetails
      }
    ]
  },
  {
    path: '',
    redirectTo: 'policies',
    pathMatch: 'full'
  }
];