
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Claim, ClaimStatus } from '../../core/models/claim.model';
import { Policy } from '../../core/models/policy.model';
import { ClaimService } from '../../core/services/claim.service';
import { PolicyService } from '../../core/services/policy.service';

interface ReviewNote {
  id: string;
  claimId: number;
  text: string;
  createdAt: string;
}

type StatusFilter = 'All' | ClaimStatus;

@Component({
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  selector: 'app-claims-review',
  styleUrl: './claims-review.css',
  templateUrl: './claims-review.html',
})
export class ClaimsReview implements OnInit, OnDestroy {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  selectedClaim?: Claim;
  selectedPolicy?: Policy;

  searchTerm = '';
  statusFilter: StatusFilter = 'All';
  noteText = '';
  reviewNotes: ReviewNote[] = [];

  isUpdatingStatus = false;
  feedbackMessage = '';

  private readonly subscriptions = new Subscription();
  private readonly notesStorageKey =
    'insurance-claims-portal.claim-review-notes';

  constructor(
    private readonly claimService: ClaimService,
    private readonly policyService: PolicyService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.claimService.getClaims().subscribe((claims) => {
        this.claims = claims;
        this.applyFilters();

        if (this.selectedClaim) {
          const refreshed = claims.find(
            (claim) => claim.id === this.selectedClaim?.id,
          );

          if (refreshed) {
            this.selectedClaim = refreshed;
          } else {
            this.closeDetails();
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get totalClaims(): number {
    return this.claims.length;
  }

  get submittedCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'Submitted',
    ).length;
  }

  get underReviewCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'Under Review',
    ).length;
  }

  get approvedCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'Approved',
    ).length;
  }

  get rejectedCount(): number {
    return this.claims.filter(
      (claim) => claim.status === 'Rejected',
    ).length;
  }

  applyFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();

    this.filteredClaims = this.claims.filter((claim) => {
      const matchesStatus =
        this.statusFilter === 'All' ||
        claim.status === this.statusFilter;

      const matchesSearch =
        !query ||
        claim.claimNumber.toLowerCase().includes(query) ||
        claim.customerName.toLowerCase().includes(query) ||
        String(claim.policyId).includes(query);

      return matchesStatus && matchesSearch;
    });
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  openDetails(claim: Claim): void {
    this.subscriptions.add(
      this.claimService.getClaimById(claim.id).subscribe((currentClaim) => {
        if (!currentClaim) {
          this.feedbackMessage = 'This claim could not be found.';
          return;
        }

        this.selectedClaim = currentClaim;
        this.selectedPolicy = undefined;

        this.reviewNotes = this.getNotes().filter(
          (note) => note.claimId === currentClaim.id,
        );

        this.subscriptions.add(
          this.policyService
            .getPolicyById(currentClaim.policyId)
            .subscribe((policy) => {
              this.selectedPolicy = policy;
            }),
        );
      }),
    );
  }

  closeDetails(): void {
    this.selectedClaim = undefined;
    this.selectedPolicy = undefined;
    this.reviewNotes = [];
    this.noteText = '';
  }

  updateStatus(status: ClaimStatus): void {
    if (!this.selectedClaim || this.isUpdatingStatus) {
      return;
    }

    const action =
      status === 'Approved'
        ? 'approve'
        : status === 'Rejected'
          ? 'reject'
          : 'move to Under Review';

    const confirmation = window.confirm(
      `Are you sure you want to ${action} claim ${this.selectedClaim.claimNumber}?`,
    );

    if (!confirmation) {
      return;
    }

    this.isUpdatingStatus = true;
    this.feedbackMessage = '';

    this.subscriptions.add(
      this.claimService
        .updateClaimStatus(this.selectedClaim.id, status)
        .subscribe({
          next: (updatedClaim) => {
            this.isUpdatingStatus = false;

            if (updatedClaim) {
              this.selectedClaim = updatedClaim;
              this.feedbackMessage =
                `Claim ${updatedClaim.claimNumber} updated to ${status}.`;
            } else {
              this.feedbackMessage =
                'The claim status could not be updated.';
            }
          },
          error: () => {
            this.isUpdatingStatus = false;
            this.feedbackMessage =
              'Something went wrong while updating the claim.';
          },
        }),
    );
  }

  addNote(): void {
    const text = this.noteText.trim();

    if (!this.selectedClaim || !text) {
      return;
    }

    const note: ReviewNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      claimId: this.selectedClaim.id,
      text,
      createdAt: new Date().toISOString(),
    };

    const notes = this.getNotes();
    notes.unshift(note);

    this.saveNotes(notes);

    this.reviewNotes = notes.filter(
      (item) => item.claimId === this.selectedClaim?.id,
    );

    this.noteText = '';
  }

  trackClaim(_index: number, claim: Claim): number {
    return claim.id;
  }

  trackNote(_index: number, note: ReviewNote): string {
    return note.id;
  }

  private getNotes(): ReviewNote[] {
    try {
      const raw = localStorage.getItem(this.notesStorageKey);

      return raw ? (JSON.parse(raw) as ReviewNote[]) : [];
    } catch {
      return [];
    }
  }

  private saveNotes(notes: ReviewNote[]): void {
    try {
      localStorage.setItem(
        this.notesStorageKey,
        JSON.stringify(notes),
      );
    } catch {
      this.feedbackMessage =
        'Unable to save the review note in this browser.';
    }
  }
}
