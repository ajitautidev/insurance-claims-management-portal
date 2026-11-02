import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimService } from '../../../../core/services/claim.service';
import { Claim, ClaimStatus } from '../../../../core/models/claim.model';
import { UploadedDocument } from '../../../../core/models/uploaded-document.model';

import { ClaimStatusComponent } from '../../components/claim-status/claim-status';
import { DocumentUpload } from '../../components/document-upload/document-upload';

@Component({
  selector: 'app-claims-history',
  standalone: true,
  imports: [
    CommonModule,
    ClaimStatusComponent,
    DocumentUpload
  ],
  templateUrl: './claims-history.html',
  styleUrl: './claims-history.css'
})
export class ClaimsHistory implements OnInit {

  private claimService = inject(ClaimService);

  claims: Claim[] = [];
  filteredClaims: Claim[] = [];

  selectedStatus = 'All';
  searchText = '';

  selectedClaim: Claim | null = null;

  editingDocuments = false;
  documentDraft: UploadedDocument[] = [];

  statuses = [
    'All',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected'
  ];

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (data) => {
        this.claims = [...data].sort(
          (a, b) =>
            new Date(b.claimDate).getTime() -
            new Date(a.claimDate).getTime()
        );

        // Keep the details popup synchronized with service updates.
        if (this.selectedClaim) {
          this.selectedClaim =
            this.claims.find(
              claim => claim.id === this.selectedClaim?.id
            ) ?? null;
        }

        this.applyFilters();
      },
      error: (error) => {
        console.error('Unable to load claims:', error);
      }
    });
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredClaims = this.claims.filter(claim => {
      const matchesStatus =
        this.selectedStatus === 'All' ||
        claim.status === this.selectedStatus;

      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(search) ||
        claim.customerName.toLowerCase().includes(search) ||
        claim.description.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  onStatusChange(event: Event): void {
    this.selectedStatus =
      (event.target as HTMLSelectElement).value;

    this.applyFilters();
  }

  onSearchChange(event: Event): void {
    this.searchText =
      (event.target as HTMLInputElement).value;

    this.applyFilters();
  }

  viewClaim(claim: Claim): void {
    this.selectedClaim = claim;
    this.editingDocuments = false;
    this.documentDraft = [...claim.documents];
  }

  closeClaimDetails(): void {
    this.selectedClaim = null;
    this.editingDocuments = false;
    this.documentDraft = [];
  }

  startDocumentUpdate(): void {
    if (!this.selectedClaim) {
      return;
    }

    this.documentDraft = [...this.selectedClaim.documents];
    this.editingDocuments = true;
  }

  onDocumentDraftChanged(documents: UploadedDocument[]): void {
    this.documentDraft = [...documents];
  }

  cancelDocumentUpdate(): void {
    this.editingDocuments = false;
    this.documentDraft = this.selectedClaim
      ? [...this.selectedClaim.documents]
      : [];
  }

  saveUpdatedDocuments(): void {
    if (!this.selectedClaim) {
      return;
    }

    this.claimService.updateClaimDocuments(
      this.selectedClaim.id,
      this.documentDraft
    ).subscribe({
      next: (updatedClaim) => {
        if (updatedClaim) {
          this.selectedClaim = updatedClaim;
          this.editingDocuments = false;
          alert('Documents updated successfully!');
        }
      },
      error: (error) => {
        console.error('Document update failed:', error);
        alert('Unable to update documents.');
      }
    });
  }

  get submittedCount(): number {
    return this.claims.filter(
      claim => claim.status === 'Submitted'
    ).length;
  }

  get underReviewCount(): number {
    return this.claims.filter(
      claim => claim.status === 'Under Review'
    ).length;
  }

  get approvedCount(): number {
    return this.claims.filter(
      claim => claim.status === 'Approved'
    ).length;
  }

  get rejectedCount(): number {
    return this.claims.filter(
      claim => claim.status === 'Rejected'
    ).length;
  }

  getStatusClass(status: ClaimStatus): string {
    switch (status) {
      case 'Submitted':
        return 'status-submitted';

      case 'Under Review':
        return 'status-review';

      case 'Approved':
        return 'status-approved';

      case 'Rejected':
        return 'status-rejected';

      default:
        return '';
    }
  }

  trackByClaimId(index: number, claim: Claim): number {
    return claim.id;
  }
}