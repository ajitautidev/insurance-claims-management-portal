import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { Claim, ClaimStatus } from '../models/claim.model';
import { UploadedDocument } from '../models/uploaded-document.model';
import { Storage } from './storage';

const CLAIM_STORAGE_KEY = 'insurance-claims-portal.claims';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private readonly claimsSubject: BehaviorSubject<Claim[]>;

  constructor(private readonly storage: Storage) {
    const savedClaims = this.storage.getItem<Claim[]>(
      CLAIM_STORAGE_KEY,
      []
    );

    this.claimsSubject = new BehaviorSubject<Claim[]>(savedClaims);
  }

  getClaims(): Observable<Claim[]> {
    return this.claimsSubject.asObservable();
  }

  getClaimById(id: number): Observable<Claim | undefined> {
    return this.claimsSubject.pipe(
      map(claims => claims.find(claim => claim.id === id))
    );
  }

  submitClaim(claim: Claim): Observable<Claim> {
    const currentClaims = this.claimsSubject.value;

    const nextId = currentClaims.length
      ? Math.max(...currentClaims.map(item => item.id)) + 1
      : 1;

    const newClaim: Claim = {
      ...claim,
      id: claim.id > 0 ? claim.id : nextId,
    };

    const updatedClaims = [...currentClaims, newClaim];

    this.storage.setItem(CLAIM_STORAGE_KEY, updatedClaims);
    this.claimsSubject.next(updatedClaims);

    return of(newClaim);
  }

  updateClaimStatus(
    id: number,
    status: ClaimStatus
  ): Observable<Claim | undefined> {
    const updatedClaims = this.claimsSubject.value.map(claim =>
      claim.id === id ? { ...claim, status } : claim
    );

    this.storage.setItem(CLAIM_STORAGE_KEY, updatedClaims);
    this.claimsSubject.next(updatedClaims);

    return this.getClaimById(id);
  }

  // NEW: Update supporting documents for an existing claim
  updateClaimDocuments(
    id: number,
    documents: UploadedDocument[]
  ): Observable<Claim | undefined> {
    const updatedClaims = this.claimsSubject.value.map(claim =>
      claim.id === id
        ? { ...claim, documents: [...documents] }
        : claim
    );

    this.storage.setItem(CLAIM_STORAGE_KEY, updatedClaims);
    this.claimsSubject.next(updatedClaims);

    return this.getClaimById(id);
  }
}