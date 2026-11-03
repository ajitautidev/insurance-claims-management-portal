import { Component } from '@angular/core';
import { ClaimForm } from './components/claims-form/claims-form';
import { ClaimsHistory } from './pages/claims-history/claims-history';

@Component({
  selector: 'app-claims-submission',
  standalone: true,
  imports: [ClaimForm, ClaimsHistory],
  templateUrl: './claims-submission.html',
  styleUrl: './claims-submission.css'
})
export class ClaimsSubmission {}