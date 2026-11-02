
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest, takeUntil } from 'rxjs';

import { ClaimService } from '../../../../core/services/claim.service';
import { PolicyService } from '../../../../core/services/policy.service';

import { Claim } from '../../../../core/models/claim.model';
import { Policy } from '../../../../core/models/policy.model';

@Component({
  selector: 'app-risk-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-overview.html',
  styleUrl: './risk-overview.css'
})
export class RiskOverview implements OnInit, OnDestroy {

  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);

  private destroy$ = new Subject<void>();

  claims: Claim[] = [];
  policies: Policy[] = [];

  highValueClaims: Claim[] = [];

  categorySummary: {
    category: string;
    count: number;
    highVolume: boolean;
  }[] = [];

  readonly highValueThreshold = 100000;

  ngOnInit(): void {
    combineLatest([
      this.claimService.getClaims(),
      this.policyService.getPolicies()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([claims, policies]: [Claim[], Policy[]]) => {
        this.claims = claims;
        this.policies = policies;
        this.calculateRiskIndicators();
      });
  }

  calculateRiskIndicators(): void {
    this.highValueClaims = this.claims.filter(
      claim => Number(claim.claimAmount) >= this.highValueThreshold
    );

    const categoryMap = new Map<string, number>();

    this.claims.forEach(claim => {
      const policy = this.policies.find(
        item => item.id === claim.policyId
      );

      const category = policy?.category ?? 'Unknown';

      categoryMap.set(
        category,
        (categoryMap.get(category) ?? 0) + 1
      );
    });

    const counts = Array.from(categoryMap.values());

    const average = counts.length
      ? this.claims.length / counts.length
      : 0;

    this.categorySummary = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        highVolume: count > average
      }))
      .sort((a, b) => b.count - a.count);
  }

  get totalHighValueAmount(): number {
    return this.highValueClaims.reduce(
      (total, claim) => total + Number(claim.claimAmount || 0),
      0
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
