import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { Policy } from '../models/policy.model';
import { Storage } from './storage';

const POLICY_STORAGE_KEY = 'insurance-claims-portal.policies';

const INITIAL_POLICIES: Policy[] = [
  {
    id: 1,
    policyNumber: 'POL-1001',
    policyName: 'Comprehensive Health Cover',
    category: 'Health',
    premium: 12000,
    coverageAmount: 500000,
    status: 'Active',
  },
  {
    id: 2,
    policyNumber: 'POL-1002',
    policyName: 'Family Health Protection',
    category: 'Health',
    premium: 18000,
    coverageAmount: 1000000,
    status: 'Active',
  },
  {
    id: 3,
    policyNumber: 'POL-2001',
    policyName: 'Secure Motor Insurance',
    category: 'Motor',
    premium: 8500,
    coverageAmount: 300000,
    status: 'Active',
  },
];

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private readonly policiesSubject: BehaviorSubject<Policy[]>;

  constructor(private readonly storage: Storage) {
    const savedPolicies = this.storage.getItem<Policy[]>(
      POLICY_STORAGE_KEY,
      INITIAL_POLICIES
    );

    this.policiesSubject = new BehaviorSubject<Policy[]>(savedPolicies);
  }

  getPolicies(): Observable<Policy[]> {
    return this.policiesSubject.asObservable();
  }

  getPolicyById(id: number): Observable<Policy | undefined> {
    return this.policiesSubject.pipe(
      map(policies => policies.find(policy => policy.id === id))
    );
  }

  addPolicy(policy: Policy): Observable<Policy> {
    const currentPolicies = this.policiesSubject.value;

    const nextId = currentPolicies.length
      ? Math.max(...currentPolicies.map(item => item.id)) + 1
      : 1;

    const newPolicy: Policy = {
      ...policy,
      id: policy.id > 0 ? policy.id : nextId,
    };

    const updatedPolicies = [...currentPolicies, newPolicy];

    this.storage.setItem(POLICY_STORAGE_KEY, updatedPolicies);
    this.policiesSubject.next(updatedPolicies);

    return of(newPolicy);
  }
}