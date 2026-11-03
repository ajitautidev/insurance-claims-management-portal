import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ClaimService } from '../../../../core/services/claim.service';
import { Claim } from '../../../../core/models/claim.model';

@Component({
  selector: 'app-risk-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-dashboard.html',
  styleUrl: './risk-dashboard.css'
})

export class RiskDashboard implements OnInit, OnDestroy {

  private claimService = inject(ClaimService);
  private destroy$ = new Subject<void>();

  claims: Claim[] = [];

  totalClaims = 0;
  approvedClaims = 0;
  rejectedClaims = 0;
  submittedClaims = 0;
  underReviewClaims = 0;
  totalClaimAmount = 0;

  ngOnInit(): void {
    this.claimService.getClaims()
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims: Claim[]) => {
        this.claims = claims;
        this.calculateDashboard();
      });
  }

  calculateDashboard(): void {
    this.totalClaims = this.claims.length;

    this.approvedClaims = this.claims.filter(
      claim => claim.status === 'Approved'
    ).length;

    this.rejectedClaims = this.claims.filter(
      claim => claim.status === 'Rejected'
    ).length;

    this.submittedClaims = this.claims.filter(
      claim => claim.status === 'Submitted'
    ).length;

    this.underReviewClaims = this.claims.filter(
      claim => claim.status === 'Under Review'
    ).length;

    this.totalClaimAmount = this.claims.reduce(
      (total, claim) => total + Number(claim.claimAmount || 0),
      0
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}