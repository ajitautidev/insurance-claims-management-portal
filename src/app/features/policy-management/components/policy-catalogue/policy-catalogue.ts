import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Policy } from '../../../../core/models/policy.model';
import { PolicyService } from '../../../../core/services/policy.service';

@Component({
  selector: 'app-policy-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy-catalogue.html',
  styleUrl: './policy-catalogue.css'
})
export class PolicyCatalogue implements OnInit {
  policies: Policy[] = [];
  searchText = '';
  selectedCategory = 'All';
  selectedStatus = 'All';
  loading = true;
  errorMessage = '';

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.loading = true;

    this.policyService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load policies.';
        this.loading = false;
      }
    });
  }

  get categories(): string[] {
    return [
      'All',
      ...new Set(this.policies.map(policy => policy.category))
    ];
  }

  get filteredPolicies(): Policy[] {
    const search = this.searchText.trim().toLowerCase();

    return this.policies.filter(policy => {
      const matchesSearch =
        String(policy.policyName).toLowerCase().includes(search) ||
        String(policy.policyNumber).toLowerCase().includes(search) ||
        String(policy.category).toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        policy.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        policy.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  viewDetails(policy: Policy): void {
    this.router.navigate(['/policies', policy.id]);
  }

  trackByPolicyId(index: number, policy: Policy): number {
    return policy.id;
  }
}