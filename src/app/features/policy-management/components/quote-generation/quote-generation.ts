
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Policy } from '../../../../core/models/policy.model';
import { PolicyService } from '../../../../core/services/policy.service';

@Component({
  selector: 'app-quote-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-generation.html',
  styleUrl: './quote-generation.css'
})
export class QuoteGeneration implements OnInit {

  policies: Policy[] = [];

  selectedPolicyId: Policy['id'] | null = null;
  selectedPolicy: Policy | null = null;

  customerName = '';
  customerEmail = '';
  customerPhone = '';
  customerAge: number | null = null;

  estimatedPremium = 0;
  quoteGenerated = false;

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        this.policies = data;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  onPolicyChange(): void {
    this.selectedPolicy =
      this.policies.find(
        policy => policy.id === this.selectedPolicyId
      ) ?? null;

    this.quoteGenerated = false;
  }

  generateQuote(): void {

    if (
      !this.selectedPolicy ||
      !this.customerName.trim() ||
      !this.customerEmail.trim() ||
      !this.customerPhone.trim() ||
      this.customerAge === null ||
      this.customerAge < 18 ||
      this.customerAge > 100
    ) {
      return;
    }

    // Illustrative frontend premium calculation.
    // This is not an actual insurance pricing formula.
    const ageFactor = this.customerAge > 50 ? 1.2 : 1;

    this.estimatedPremium =
      Number(this.selectedPolicy.premium) * ageFactor;

    this.quoteGenerated = true;
  }

  resetForm(): void {
    this.selectedPolicyId = null;
    this.selectedPolicy = null;

    this.customerName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.customerAge = null;

    this.estimatedPremium = 0;
    this.quoteGenerated = false;
  }
}
