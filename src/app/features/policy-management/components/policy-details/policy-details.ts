import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from '../../../../core/models/policy.model';
import { PolicyService } from '../../../../core/services/policy.service';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-details.html',
  styleUrl: './policy-details.css'
})
export class PolicyDetails implements OnInit {
  policy: Policy | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.errorMessage = 'Invalid policy ID.';
      this.loading = false;
      return;
    }

    this.policyService.getPolicyById(id).subscribe({
      next: (policy) => {
        this.policy = policy ?? null;
        this.loading = false;

        if (!this.policy) {
          this.errorMessage = 'Policy not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load policy details.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/policies/catalogue']);
  }
}