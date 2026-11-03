
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';

import { ClaimService } from '../../../../core/services/claim.service';
import { PolicyService } from '../../../../core/services/policy.service';

import { Claim } from '../../../../core/models/claim.model';
import { Policy } from '../../../../core/models/policy.model';

@Component({
  selector: 'app-claims-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './claims-analytics.html',
  styleUrl: './claims-analytics.css'
})
export class ClaimsAnalytics
  implements OnInit, AfterViewInit, OnDestroy {

  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);

  private destroy$ = new Subject<void>();

  claims: Claim[] = [];
  policies: Policy[] = [];

  private viewReady = false;
  private charts: Chart[] = [];

  ngOnInit(): void {
    combineLatest([
      this.claimService.getClaims(),
      this.policyService.getPolicies()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([claims, policies]: [Claim[], Policy[]]) => {
        this.claims = claims;
        this.policies = policies;

        if (this.viewReady) {
          this.createCharts();
        }
      });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.createCharts();
  }

  createCharts(): void {
    this.destroyCharts();

    this.createStatusChart();
    this.createCategoryChart();
    this.createAmountChart();
  }

  createStatusChart(): void {
    const canvas = document.getElementById(
      'statusChart'
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const statuses = [
      'Submitted',
      'Under Review',
      'Approved',
      'Rejected'
    ];

    const counts = statuses.map(status =>
      this.claims.filter(claim => claim.status === status).length
    );

    this.charts.push(new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: statuses,
        datasets: [{
          data: counts,
          backgroundColor: [
            '#7c3aed',
            '#f59e0b',
            '#16a34a',
            '#dc2626'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }));
  }

  createCategoryChart(): void {
    const canvas = document.getElementById(
      'categoryChart'
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const categoryCounts = new Map<string, number>();

    this.claims.forEach(claim => {
      const policy = this.policies.find(
        item => item.id === claim.policyId
      );

      const category = policy?.category ?? 'Unknown';

      categoryCounts.set(
        category,
        (categoryCounts.get(category) ?? 0) + 1
      );
    });

    this.charts.push(new Chart(canvas, {
      type: 'bar',
      data: {
        labels: Array.from(categoryCounts.keys()),
        datasets: [{
          label: 'Number of Claims',
          data: Array.from(categoryCounts.values()),
          backgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    }));
  }

  createAmountChart(): void {
    const canvas = document.getElementById(
      'amountChart'
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const monthlyAmounts = new Map<string, number>();

    this.claims.forEach(claim => {
      const date = new Date(claim.claimDate);

      if (Number.isNaN(date.getTime())) return;

      const monthKey =
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      monthlyAmounts.set(
        monthKey,
        (monthlyAmounts.get(monthKey) ?? 0) +
        Number(claim.claimAmount || 0)
      );
    });

    const sortedMonths = Array.from(monthlyAmounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));

    const labels = sortedMonths.map(([key]) => {
      const [year, month] = key.split('-').map(Number);

      return new Date(year, month - 1, 1).toLocaleString('en-IN', {
        month: 'short',
        year: 'numeric'
      });
    });

    this.charts.push(new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Claim Amount (₹)',
          data: sortedMonths.map(([, amount]) => amount),
          borderColor: '#0891b2',
          backgroundColor: 'rgba(8, 145, 178, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }));
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
