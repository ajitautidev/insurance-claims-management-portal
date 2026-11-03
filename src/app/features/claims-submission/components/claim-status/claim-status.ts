
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimStatus } from '../../../../core/models/claim.model';

@Component({
  selector: 'app-claim-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './claim-status.html',
  styleUrl: './claim-status.css'
})
export class ClaimStatusComponent {

  @Input({ required: true }) status!: ClaimStatus;

  get currentStep(): number {
    switch (this.status) {
      case 'Submitted':
        return 1;

      case 'Under Review':
        return 2;

      case 'Approved':
      case 'Rejected':
        return 3;

      default:
        return 0;
    }
  }

  get finalStatus(): string {
    return this.status === 'Rejected' ? 'Rejected' : 'Approved';
  }

  isCompleted(step: number): boolean {
    if (this.status === 'Rejected' && step === 3) {
      return false;
    }

    return step < this.currentStep;
  }

  isActive(step: number): boolean {
    return step === this.currentStep;
  }
}
