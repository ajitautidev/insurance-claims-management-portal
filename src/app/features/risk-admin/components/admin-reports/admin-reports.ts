
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ClaimService } from '../../../../core/services/claim.service';
import { PolicyService } from '../../../../core/services/policy.service';

import {
  Claim,
  ClaimStatus
} from '../../../../core/models/claim.model';

import { Policy } from '../../../../core/models/policy.model';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit, OnDestroy {

  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);

  private destroy$ = new Subject<void>();

  claims: Claim[] = [];
  policies: Policy[] = [];

  startDate = '';
  endDate = '';

  selectedStatus: 'All' | ClaimStatus = 'All';

  readonly statuses: ('All' | ClaimStatus)[] = [
    'All',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected'
  ];

  ngOnInit(): void {
    this.claimService.getClaims()
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims: Claim[]) => {
        this.claims = claims;
      });

    this.policyService.getPolicies()
      .pipe(takeUntil(this.destroy$))
      .subscribe((policies: Policy[]) => {
        this.policies = policies;
      });
  }

  get filteredClaims(): Claim[] {
    return this.claims.filter(claim => {
      const claimDate = new Date(claim.claimDate);

      const validDate = !Number.isNaN(claimDate.getTime());

      const afterStart =
        !this.startDate ||
        (
          validDate &&
          claimDate >= new Date(this.startDate + 'T00:00:00')
        );

      const beforeEnd =
        !this.endDate ||
        (
          validDate &&
          claimDate <= new Date(this.endDate + 'T23:59:59')
        );

      const statusMatches =
        this.selectedStatus === 'All' ||
        claim.status === this.selectedStatus;

      return afterStart && beforeEnd && statusMatches;
    });
  }

  get totalClaims(): number {
    return this.filteredClaims.length;
  }

  get totalAmount(): number {
    return this.filteredClaims.reduce(
      (total, claim) => total + Number(claim.claimAmount || 0),
      0
    );
  }

  get approvedCount(): number {
    return this.filteredClaims.filter(
      claim => claim.status === 'Approved'
    ).length;
  }

  get rejectedCount(): number {
    return this.filteredClaims.filter(
      claim => claim.status === 'Rejected'
    ).length;
  }

  get underReviewCount(): number {
    return this.filteredClaims.filter(
      claim => claim.status === 'Under Review'
    ).length;
  }

  getPolicyCategory(policyId: number): string {
    const policy = this.policies.find(
      item => item.id === policyId
    );

    return policy?.category ?? 'Unknown';
  }

  clearFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedStatus = 'All';
  }

  exportCSV(): void {
    const headers = [
      'Claim Number',
      'Customer Name',
      'Policy Category',
      'Claim Amount',
      'Claim Date',
      'Status',
      'Description'
    ];

    const rows = this.filteredClaims.map(claim => [
      claim.claimNumber,
      claim.customerName,
      this.getPolicyCategory(claim.policyId),
      String(claim.claimAmount),
      claim.claimDate,
      claim.status,
      claim.description
    ]);

    const escapeCSV = (value: string): string =>
      `"${value.replace(/"/g, '""')}"`;

    const csvContent = [
      headers,
      ...rows
    ]
      .map(row =>
        row.map(value => escapeCSV(String(value ?? ''))).join(',')
      )
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'insurance-claims-report.csv';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
