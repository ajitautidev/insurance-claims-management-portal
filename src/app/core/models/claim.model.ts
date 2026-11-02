import type { UploadedDocument } from './uploaded-document.model';

export type ClaimStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export interface Claim {
  id: number;
  claimNumber: string;
  policyId: number;
  customerId: number;
  customerName: string;
  claimAmount: number;
  claimDate: string;
  description: string;
  status: ClaimStatus;
  documents: UploadedDocument[];
}