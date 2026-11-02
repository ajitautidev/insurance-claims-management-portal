export type PolicyStatus = 'Active' | 'Expired' | 'Pending';

export interface Policy {
  id: number;
  policyNumber: string;
  policyName: string;
  category: string;
  premium: number;
  coverageAmount: number;
  status: PolicyStatus;
}