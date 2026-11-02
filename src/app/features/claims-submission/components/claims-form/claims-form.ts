
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PolicyService } from '../../../../core/services/policy.service';
import { ClaimService } from '../../../../core/services/claim.service';

import { Policy } from '../../../../core/models/policy.model';
import { Claim } from '../../../../core/models/claim.model';
import { UploadedDocument } from '../../../../core/models/uploaded-document.model';

import { DocumentUpload } from '../document-upload/document-upload';

@Component({
  selector: 'app-claims-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentUpload
  ],
  templateUrl: './claims-form.html',
  styleUrl: './claims-form.css'
})
export class ClaimForm implements OnInit {
  today = new Date().toISOString().split('T')[0];

  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);
  private claimService = inject(ClaimService);

  @ViewChild(DocumentUpload) documentUpload!: DocumentUpload;

  claimForm!: FormGroup;
  policies: Policy[] = [];
  uploadedDocuments: UploadedDocument[] = [];

  isSubmitted = false;

  ngOnInit(): void {

    this.claimForm = this.fb.group({

      policyId: ['', Validators.required],

      customerId: ['', Validators.required],

      customerName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      claimAmount: ['', [
        Validators.required,
        Validators.min(1)
      ]],

      claimDate: ['', Validators.required],

      description: ['', [
        Validators.required,
        Validators.minLength(20)
      ]]

    });

    this.policyService.getPolicies().subscribe({

      next: (data) => {
        this.policies = data;
      },

      error: (error) => {
        console.error('Unable to load policies', error);
      }

    });
  }

  get formControls() {
    return this.claimForm.controls;
  }

  onDocumentsChanged(documents: UploadedDocument[]): void {
    this.uploadedDocuments = documents;
  }

  submitClaim(): void {

    this.isSubmitted = false;

    if (this.claimForm.invalid) {

      this.claimForm.markAllAsTouched();
      return;

    }

    const formValue = this.claimForm.value;

    const claim: Claim = {

      id: 0,

      claimNumber: 'CLM-' + Date.now(),

      policyId: Number(formValue.policyId),

      customerId: Number(formValue.customerId),

      customerName: formValue.customerName,

      claimAmount: Number(formValue.claimAmount),

      claimDate: formValue.claimDate,

      description: formValue.description,

      status: 'Submitted',

      documents: [...this.uploadedDocuments]

    };

    this.claimService.submitClaim(claim).subscribe({

      next: () => {

        this.isSubmitted = true;

        this.claimForm.reset();

        this.uploadedDocuments = [];

        this.documentUpload?.clearDocuments();

        alert('Claim submitted successfully!');

      },

      error: (error) => {

        console.error('Claim submission failed', error);

        alert('Unable to submit claim.');

      }

    });

  }

}
